const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register New User
exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ error: "Username already taken" });

    // Create new user
    user = new User({ username, password });
    await user.save();

    res.status(201).json({
      _id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    // Send JWT token
    res.json({
      _id: user.id,
      username: user.username,
      token: generateToken(user.id),
    });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
};
