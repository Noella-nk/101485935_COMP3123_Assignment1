
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Register a new user
const signup = async (request, response) => {
  try {
    const { username, email, password } = request.body;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if (existingUser) {
      return response.status(409).json({
        message: "Username or email already exists",
      })
    }

    const user = await User.create({ username, email, password })

    return response.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    // Handle duplicate-key errors, including simultaneous registrations
    if (error.code === 11000) {
      return response.status(409).json({
        message: "Username or email is already registered",
    });
  }

if (error.name === "ValidationError") {
  return response.status(400).json({message: error.message})
}

return response.status(500).json({message: "Server error. Please try again later."})

};

// Log in an existing user
const login = async (request, response) => {
  try {
    const { username, email, password } = request.body

    if (!password || (!username && !email)) {
      return response.status(400).json({
        message: "Provide a username or email and a password!",
      })
    }

    const identifier = username || email;

    const user = await User.findOne({
      [username ? "username" : "email"]: identifier,
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return response.status(401).json({
        message: "Invalid username/email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Server authentication configuration error",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, login,}

}