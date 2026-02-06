import mongoose from "mongoose";
import "dotenv/config";
import { QRCode } from "../src/models/qrCode.js";
import fs from "fs-extra";
import path from "path";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/supply-integrity-track";
const QR_CODES_DIR = path.resolve("../../blockchain/qr-codes");

async function importQRCodes() {
  await mongoose.connect(MONGO_URI);
  const files = await fs.readdir(QR_CODES_DIR);
  let imported = 0;
  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(QR_CODES_DIR, file);
      const data = await fs.readJson(filePath);
      const batchId = data.batchId?.toString() || path.basename(file, ".json");

      // Try to find a matching PNG image
      const imageFile = file.replace(/_data\.json$/, ".png");
      const imagePath = path.join(QR_CODES_DIR, imageFile);
      let imageBuffer = undefined;
      let imageType = undefined;
      if (await fs.pathExists(imagePath)) {
        imageBuffer = await fs.readFile(imagePath);
        imageType = "image/png";
      }

      await QRCode.updateOne(
        { batchId },
        { $set: { qrData: data, image: imageBuffer, imageType } },
        { upsert: true },
      );
      imported++;
    }
  }
  await mongoose.disconnect();
  console.log(`Imported ${imported} QR codes to MongoDB.`);
}

importQRCodes().catch((err) => {
  console.error("Error importing QR codes:", err);
  process.exit(1);
});
