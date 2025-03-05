const Cat = require("../models/Cat");
const fs = require("fs");
const path = require("path");

// Upload a cat pic
exports.uploadCatPic = async (req, res) => {
  try {
    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File Uploaded:", req.file);

    const newCat = new Cat({
      user: req.user.id,
      filename: req.file.filename,
      path: req.file.path,
    });

    await newCat.save();
    console.log("Cat picture uploaded successfully:", newCat);
    res.status(201).json(newCat);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload cat picture" });
  }
};
// Fetch all uploaded cat pics
exports.getAllCatPics = async (req, res) => {
  try {
    const cats = await Cat.find({ user: req.user.id });
    console.log("User's stored cat pictures:", cats);

    res.status(200).json(cats);
  } catch (err) {
    console.error("Error fetching cat pictures:", err);
    res.status(500).json({ error: "Failed to fetch cat pictures" });
  }
};

// Fetch a specific cat picture (Only if owned by the user)
exports.getCatPicById = async (req, res) => {
  try {
    const cat = await Cat.findOne({ _id: req.params.id, user: req.user.id });
    if (!cat) return res.status(404).json({ error: "Cat picture not found" });

    res.sendFile(path.resolve(cat.path));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cat picture" });
  }
};

// Update a cat picture (Only if owned by the user)
exports.updateCatPic = async (req, res) => {
  try {
    const cat = await Cat.findOne({ _id: req.params.id, user: req.user.id });
    if (!cat) return res.status(404).json({ error: "Cat picture not found" });

    // Update filename and path if a new file is provided
    if (req.file) {
      cat.filename = req.file.filename;
      cat.path = req.file.path;
    }

    await cat.save();
    res.status(200).json(cat);
  } catch (err) {
    res.status(500).json({ error: "Failed to update cat picture" });
  }
};

// Delete a cat picture (Only if owned by the user)
exports.deleteCatPic = async (req, res) => {
  try {
    const cat = await Cat.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!cat) return res.status(404).json({ error: "Cat picture not found" });

    res.status(200).json({ message: "Cat picture deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete cat picture" });
  }
};
