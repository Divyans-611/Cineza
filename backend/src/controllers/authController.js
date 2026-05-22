import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    // 1. Validate required fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, username, email, and password',
      })
    }

    const trimmedName = name.trim()
    const trimmedUsername = username.trim().toLowerCase()
    const trimmedEmail = email.trim().toLowerCase()

    // 2. Validate password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    // 3. Check if email already exists
    const emailExists = await User.findOne({ email: trimmedEmail })
    if (emailExists) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // 4. Check if username already exists
    const usernameExists = await User.findOne({ username: trimmedUsername })
    if (usernameExists) {
      return res.status(409).json({
        success: false,
        message: 'Username is already taken',
      })
    }

    // 5. Create new user (pre-save hook in User model will hash password)
    const user = await User.create({
      name: trimmedName,
      username: trimmedUsername,
      email: trimmedEmail,
      password: password,
      authProvider: 'local',
    })

    if (user) {
      const token = generateToken(user._id)
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          authProvider: user.authProvider,
          avatar: user.avatar,
          bio: user.bio,
          xp: user.xp,
          level: user.level,
          badges: user.badges,
        },
      })
    } else {
      return res.status(500).json({
        success: false,
        message: 'Invalid user data received',
      })
    }
  } catch (error) {
    console.error('Registration error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    })
  }
}

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // 1. Validate fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    const trimmedEmail = email.trim().toLowerCase()

    // 2. Find user and explicitly select password
    const user = await User.findOne({ email: trimmedEmail }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // 3. Check Google auth compatibility
    if (user.authProvider === 'google' && !user.password) {
      return res.status(401).json({
        success: false,
        message: 'This account uses Google login. Please continue with Google.',
      })
    }

    // 4. Verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    const token = generateToken(user._id)
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        authProvider: user.authProvider,
        avatar: user.avatar,
        bio: user.bio,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
      },
    })
  } catch (error) {
    console.error('Login error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    })
  }
}

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = req.user
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        authProvider: user.authProvider,
        avatar: user.avatar,
        bio: user.bio,
        xp: user.xp,
        level: user.level,
        badges: user.badges,
      },
    })
  } catch (error) {
    console.error('Get profile error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Server error fetching user profile',
    })
  }
}
