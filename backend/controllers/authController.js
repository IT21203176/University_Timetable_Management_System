const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { JWT_SECRET } = process.env;

// Validate email format
const validateEmail = (email) => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

// Validate mobile number format
const validateMobileNo = (mobileNo) => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobileNo);
};

// Validate password length
const validatePassword = (password) => {
  return password.length >= 8;
};

// Register a new user
const register = async (req, res) => {
  // Destructure request body to extract user data
  const {
    name,
    email,
    mobileNo,
    universityId,
    facultyDepartment,
    program,
    password,
    role,
    groupName,
    year, // Added for student registration
    semester, // Added for student registration
    dayType, // Added for student registration
  } = req.body;

  // Assuming user role is passed through the token
  const tokenRole = req.user.role;

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(400).json({
        message: "Permission denied. Only Admins can register new users.",
      });
    }

    // Validate input data
    if (
      !name ||
      !email ||
      !mobileNo ||
      !universityId ||
      !facultyDepartment ||
      !program ||
      !password ||
      !role
    ) {
      return res.status(403).json({
        message:
          "Name, email, mobileNo, faculty, department, university ID, password and role are required",
      });
    }

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(403).json({ message: "Invalid email format" });
    }

    // Validate mobile number format
    if (!validateMobileNo(mobileNo)) {
      return res.status(403).json({ message: "Invalid mobile number format" });
    }

    // Validate password length
    if (!validatePassword(password)) {
      return res.status(403).json({
        message: "Password must be at least 8 characters long",
      });
    }


    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { universityId }],
    });
    if (existingUser) {
      return res.status(403).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      mobileNo,
      universityId,
      facultyDepartment,
      program,
      password: hashedPassword,
      role,
      groupName,
      year,
      semester,
      dayType,
    });

    if (role === "Student") {
      const count = await User.countDocuments({ role: "Student" });
      const departmentCode = newUser.facultyDepartment[0].department
        .split(" ")[0]
        .toUpperCase();
      const groupName = `Y${year}.S${semester}.${dayType}.${departmentCode}.${Math.ceil(
        (count + 1) / 10
      )}`;
      newUser.groupName = groupName;
      newUser.year = year; // Assign year for student
      newUser.semester = semester; // Assign semester for student
      newUser.dayType = dayType; // Assign dayType for student
    }

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { universityId, email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ $or: [{ email }, { universityId }] });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  // Assuming user role is passed through the token
  const tokenRole = req.user.role;

  try {
    // Check if the user is an admin
    if (tokenRole !== "Admin") {
      return res.status(403).json({
        message: "Permission denied. Only Admins can register new users.",
      });
    }

    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user details based on role
const getUsersByRole = async (req, res) => {
  const { role } = req.params;
  try {
    const users = await User.find({ role });
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTimetableByGroupName = async (req, res) => {
  const user = req.user; // Assuming user is authenticated and role is 'Student'

  try {
    const timetableSessions = await user.getTimetableSessions();
    res.status(200).json(timetableSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getUsersByRole,
  getUserById,
  getTimetableByGroupName,
  validateEmail, 
  validateMobileNo, 
  validatePassword,
};
