import express from "express";
import {
  getBatch,
  getTransfers,
  getAlerts,
  addBatch,
  addTransfer,
} from "../models/store.js";
import { Batch } from "../models/mongoModels.js";
import { QRCode } from "../models/qrCode.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// POST upload QR code JSON and image
router.post(
  "/qr-codes/upload",
  upload.fields([
    { name: "json", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files["json"] || req.files["json"].length === 0) {
        return res.status(400).json({ error: "QR code JSON file is required" });
      }
      const jsonBuffer = req.files["json"][0].buffer;
      const qrData = JSON.parse(jsonBuffer.toString());
      const batchId = qrData.batchId?.toString();
      let imageBuffer = undefined;
      let imageType = undefined;
      if (req.files["image"] && req.files["image"].length > 0) {
        imageBuffer = req.files["image"][0].buffer;
        imageType = req.files["image"][0].mimetype;
      }
      const doc = await QRCode.findOneAndUpdate(
        { batchId },
        { $set: { qrData, image: imageBuffer, imageType } },
        { upsert: true, new: true },
      );
      // Also update the batch in the batches collection with the latest QR data
      if (qrData && batchId) {
        await Batch.updateOne(
          { batchId: batchId.toString() },
          { $set: { ...qrData } },
          { upsert: true },
        );
      }
      res.json({ success: true, qrCode: doc });
    } catch (err) {
      res
        .status(500)
        .json({ error: "Failed to upload QR code", details: err.message });
    }
  },
);

// (Removed duplicate router initialization)

// GET all QR codes
router.get("/qr-codes", async (req, res) => {
  try {
    const qrCodes = await QRCode.find();
    // Optionally return image as base64 if requested
    if (req.query.withImage === "1") {
      const result = qrCodes.map((qr) => {
        const obj = qr.toObject();
        if (obj.image) {
          obj.image = obj.image.toString("base64");
        }
        return obj;
      });
      res.json(result);
    } else {
      // By default, do not include image buffer
      const result = qrCodes.map(
        ({ _id, batchId, qrData, imageType, createdAt }) => ({
          _id,
          batchId,
          qrData,
          imageType,
          createdAt,
        }),
      );
      res.json(result);
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch QR codes" });
  }
});

// GET batch info
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const batch = await getBatch(id);
  if (!batch) return res.status(404).json({ error: "Batch not found" });

  res.json({
    batch,
    transfers: await getTransfers(id),
    alerts: await getAlerts(id),
  });
});

// POST create batch
router.post("/", async (req, res) => {
  const { batchId } = req.body;
  if (!batchId) return res.status(400).json({ error: "batchId required" });

  await addBatch(batchId);
  res.json({ success: true, batchId });
});

// POST add transfer
router.post("/:id/transfers", async (req, res) => {
  const { id } = req.params;
  const { from, to } = req.body;

  if (!from || !to)
    return res.status(400).json({ error: "from and to required" });

  const transfer = { batchId: id, from, to, timestamp: Date.now() };
  await addTransfer(transfer);

  res.json({ success: true, transfer });
});

export default router;
