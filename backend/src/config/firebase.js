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
            // Auto-generate a unique key when no id is provided (like Firestore)
            if (!id) {
              id = `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
            }
            const path = `${base}/${encodeURIComponent(name)}/${encodeURIComponent(id)}.json`;
            return {
              set: async (data, opts) => {
                // Support { merge: true } by reading existing data first
                if (opts && opts.merge) {
                  const existing = await fetch(path).then(r => r.json()).catch(() => null);
                  if (existing && typeof existing === 'object') {
                    data = { ...existing, ...data };
                  }
                }
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
          orderBy(field, direction) {
            return {
              get: async () => {
                const url = `${base}/${encodeURIComponent(name)}.json`;
                const res = await fetch(url);
                const json = await res.json();
                const docs = [];
                if (json && typeof json === 'object') {
                  for (const k of Object.keys(json)) {
                    docs.push({ data: () => json[k] });
                  }
                }
                docs.sort((a, b) => {
                  const va = a.data()?.[field] ?? 0;
                  const vb = b.data()?.[field] ?? 0;
                  return direction === 'desc' ? vb - va : va - vb;
                });
                return { docs };
              },
            };
          },
          where(field, op, value) {
            return {
              get: async () => {
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
  }
}

if (!db) {
  console.error("FATAL: No Firebase database configured. Set FIREBASE_DATABASE_URL or FIREBASE_SERVICE_ACCOUNT in .env");
  process.exit(1);
}

export { db };
