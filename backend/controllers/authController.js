const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { name, role, username, password } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Error 400: User already exists.' });

        const user = await User.create({ name, role, username, password });
        res.status(201).json({ id: user.id, name: user.name, role: user.role, username: user.username, token: generateToken(user.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ id: user.id, name: user.name, role: user.role, username: user.username, token: generateToken(user.id) });
        } else {
            res.status(401).json({ message: 'Error 401: Username or password is invalid.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Error 404: User not found.' });
      }
  
      res.status(200).json({
        name: user.name,
        role: user.role,
        username: user.username,
        password: user.password,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error 500: Server error.', error: error.message });
    }
  };

const updateUserProfile = async (req, res) => {
    const { name, role, username, password } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Error 404: User not found.' });

        user.name = name || user.name;
        user.role = role || user.role;
        user.username = username || user.username;
        user.password = password || user.password;

        const updatedUser = await user.save();
        res.json({ id: updatedUser.id, name: updatedUser.name, role: updatedUser.role, username: updatedUser.username, password: updatedUser.password, token: generateToken(updatedUser.id) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Error 404: User not found.' });

        await user.remove();
        res.json({ message: 'User deleted.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile, updateUserProfile, deleteUser };