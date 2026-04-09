const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;

    console.log("Received request with:", req.body);
    console.log("Original password:", password);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed password before saving:", hashedPassword);
    // Create a new user
    const user = await User.create({
      email,
      password: hashedPassword, // Store hashed password
      username,
      createdAt,
    });

    console.log("User created successfully:", user);

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true, // Set to true for security
      secure: process.env.NODE_ENV === "production", // Secure in production
    });

    res.status(201).json({ message: "User signed up successfully", success: true, user });
    next();
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


module.exports.Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }

    console.log("🔹 Entered password:", password);
    console.log("🔹 Stored hashed password:", user.password);

    const auth = await bcrypt.compare(password, user.password);
    console.log("🔹 Password match result:", auth);

    if (!auth) {
      return res.status(400).json({ message: "Incorrect password or email" });
    }

    // Generate token
    const token = createSecretToken(user._id);

    // Set cookie properly
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true, // Make it true for security reasons
      secure: process.env.NODE_ENV === "production", // Secure cookie in production
    });

    res.status(200).json({ message: "User logged in successfully", success: true });
    next();
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

