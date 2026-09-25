const express = require("express");
const mongoose = require("mongoose");
const connectToMongoDB = require("../DB/db");

const app = express();
app.use(express.json());

// Hubungkan ke database
connectToMongoDB();

// Skema data sederhana untuk CRUD
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

// Mencegah error OverwriteModelError di Vercel Serverless
const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

// Root route (Supaya tidak "Cannot GET /")
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

// --- FITUR CRUD ---

// 1. CREATE (Tambah Data) - POST /api/items
app.post("/api/items", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json({ message: "Data berhasil ditambahkan", data: savedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. READ (Lihat Semua Data) - GET /api/items
app.get("/api/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. UPDATE (Ubah Data berdasarkan ID) - PUT /api/items/:id
app.put("/api/items/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({ message: "Data berhasil diubah", data: updatedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. DELETE (Hapus Data berdasarkan ID) - DELETE /api/items/:id
app.delete("/api/items/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = (req, res) => {
  app(req, res);
};
