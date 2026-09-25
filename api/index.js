const express = require("express");
const mongoose = require("mongoose");
const connectToMongoDB = require("../DB/db");

const app = express();
app.use(express.json());

// Skema data sederhana untuk CRUD
const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

// 1. CREATE (Tambah Data) - POST /api/items
app.post("/api/items", async (req, res) => {
  try {
    await connectToMongoDB(); // Pastikan koneksi dipanggil di dalam endpoint
    const newItem = new Item({
      name: req.body.name,
      description: req.body.description
    });
    const savedItem = await newItem.save();
    res.status(201).json({ message: "Data berhasil ditambahkan", data: savedItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. READ (Lihat Semua Data) - GET /api/items
app.get("/api/items", async (req, res) => {
  try {
    await connectToMongoDB();
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. DELETE (Hapus Data berdasarkan ID) - DELETE /api/items/:id
app.delete("/api/items/:id", async (req, res) => {
  try {
    await connectToMongoDB();
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = (req, res) => {
  app(req, res);
};
