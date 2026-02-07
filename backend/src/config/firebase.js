import admin from "firebase-admin";

let db;

// Only initialize the real Firebase Admin SDK if explicit credentials are provided.
// This avoids runtime auth errors when running locally without service account.
const hasServiceAccount = !!process.env.FIREBASE_SERVICE_ACCOUNT;
const hasGoogleCreds = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (hasServiceAccount || hasGoogleCreds) {
  try {
    if (!admin.apps.length) {
      if (hasServiceAccount) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      } else {
        admin.initializeApp();
      }
    }

    db = admin.firestore();
    console.log("Firebase admin initialized");
  } catch (err) {
    console.warn("Firebase admin init failed, falling back to in-memory DB:", err.message);
  }
}

if (!db) {
  // Prefer Realtime Database REST adapter if client config available
  const rtdbUrl = process.env.FIREBASE_DATABASE_URL;

  if (rtdbUrl) {
    console.log("Using Realtime Database REST adapter at", rtdbUrl);

    const fetch = globalThis.fetch;

    db = {
      collection(name) {
        const base = rtdbUrl.replace(/\/+$/,'');
        return {
          doc(id) {
            const path = `${base}/${encodeURIComponent(name)}/${encodeURIComponent(id)}.json`;
            return {
              set: async (data) => {
                const res = await fetch(path, { method: 'PUT', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json' } });
                return res.json();
              },
              get: async () => {
                const res = await fetch(path);
                if (res.status === 200) {
                  const json = await res.json();
                  if (json === null) return { exists: false, data: () => undefined };
                  return { exists: true, data: () => json };
                }
                return { exists: false, data: () => undefined };
              }
            };
          },
          where(field, op, value) {
            return {
              get: async () => {
                // Use simple filter by fetching all and filtering locally (RTDB REST supports queries but needs orderBy)
                const url = `${base}/${encodeURIComponent(name)}.json`;
                const res = await fetch(url);
                const json = await res.json();
                const docs = [];
                if (json && typeof json === 'object') {
                  for (const k of Object.keys(json)) {
                    const v = json[k];
                    if (v && v[field] == value) docs.push({ data: () => v });
                  }
                }
                return { docs };
              }
            };
          }
        };
      }
    };

    // db set to RTDB REST adapter above
  }

  // Simple in-memory Firestore-like fallback for development/testing
  const mem = Object.create(null);
  let autoId = 0;

  db = {
    collection(name) {
      if (!mem[name]) mem[name] = new Map();

      return {
        doc(id) {
          let key = id;
          if (!key) {
            key = String(++autoId);
          }

          return {
            set: async (data) => {
              mem[name].set(String(key), data);
              return;
            },
            get: async () => {
              const exists = mem[name].has(String(key));
              return {
                exists,
                data: () => (exists ? mem[name].get(String(key)) : undefined),
              };
            },
          };
        },
        orderBy(field, direction) {
          // Return a query-like object with .get() that returns sorted docs
          return {
            get: async () => {
              const docs = [];
              for (const [_k, v] of mem[name].entries()) {
                docs.push({ data: () => v });
              }
              docs.sort((a, b) => {
                const va = a.data()[field] ?? 0;
                const vb = b.data()[field] ?? 0;
                return direction === 'desc' ? vb - va : va - vb;
              });
              return { docs };
            },
          };
        },
        where(field, op, value) {
          return {
            get: async () => {
              const docs = [];
              for (const [_k, v] of mem[name].entries()) {
                if (v && v[field] === value) {
                  docs.push({ data: () => v });
                }
              }
              return { docs };
            },
          };
        },
      };
    },
  };

  console.log("Using in-memory Firestore fallback (FIREBASE not configured)");
}

export { db };
