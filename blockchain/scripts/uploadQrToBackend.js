// This script uploads a QR code JSON and image to the backend using the upload API.
// Usage: node uploadQrToBackend.js <jsonPath> <imagePath>

import fs from "fs";
import path from "path";
import axios from "axios";
import FormData from "form-data";

const BACKEND_URL =
  process.env.BACKEND_URL ||
  "http://localhost:5000/api/batches/qr-codes/upload";

async function uploadQr(jsonPath, imagePath) {
  const form = new FormData();
  form.append("json", fs.createReadStream(jsonPath));
  if (imagePath && fs.existsSync(imagePath)) {
    form.append("image", fs.createReadStream(imagePath));
  }

  try {
    const res = await axios.post(BACKEND_URL, form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    console.log("Upload successful:", res.data);
  } catch (err) {
    console.error("Upload failed:", err.response?.data || err.message);
    process.exit(1);
  }
}

const [, , jsonPath, imagePath] = process.argv;
if (!jsonPath) {
  console.error("Usage: node uploadQrToBackend.js <jsonPath> <imagePath>");
  process.exit(1);
}

uploadQr(jsonPath, imagePath);
