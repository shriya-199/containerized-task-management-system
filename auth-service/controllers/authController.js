const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const userModel = require('../models/userModel');

function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

function isAllowedRole(role) {
  return ['admin', 'manager', 'member'].includes(role);
}

function validateCredentials(payload) {
  const errors = [];

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('valid email is required');
  }

  if (!payload.password || payload.password.length < 8) {
    errors.push('password must be at least 8 characters');
  }

  return errors;
}

async function register(req, res, next) {
  try {
    const errors = validateCredentials(req.body);
    if (!req.body.name || req.body.name.trim().length < 2) {
      errors.push('name must be at least 2 characters');
    }
    if (req.body.role !== undefined && !isAllowedRole(req.body.role)) {
      errors.push('role must be one of admin, manager, member');
    }

    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const email = req.body.email.toLowerCase();
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 12);
    const user = {
      id: uuidv4(),
      name: req.body.name.trim(),
      email,
      passwordHash,
      role: req.body.role || 'member'
    };

    await userModel.create(user);
    return res.status(201).json({ data: sanitizeUser(user) });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const errors = validateCredentials(req.body);
    if (errors.length) {
      return res.status(400).json({ errors });
    }

    const user = await userModel.findByEmail(req.body.email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET || 'change-me-in-production',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return res.status(200).json({
      data: {
        token,
        user: sanitizeUser(user)
      }
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  register,
  login
};
