import { QRCode } from "../models/qrCode.js";
import fs from "fs";
import path from "path";

export async function importQRCodesFromFolder(folderPath) {
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(folderPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
      await QRCode.create({ batchId: data.batchId || file, qrData: data });
    }
  }
}

export async function getQRCode(batchId) {
  return await QRCode.findOne({ batchId });
}

export async function getAllQRCodes() {
  return await QRCode.find();
}
