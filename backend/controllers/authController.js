const { UserFactory } = require('../factories/UserFactory');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { username, password, fname, lname, clinic, role } = req.body;
    try {
        const userExists = await User.findOne({ username });
        if (userExists) return res.status(400).json({ message: 'Error 400: User already exists.' });

        // Rachel's note: Using the Factory design pattern to create different types of User objects based on a given role.
        const userInstance = UserFactory.createUser(username, password, fname, lname, clinic, role);

        const user = new User({
            username: userInstance.username,
            password: userInstance.password,
            fname: userInstance.fname,
            lname: userInstance.lname,
            clinic: userInstance.clinic,
            role: userInstance.role,
        });
        await user.save();

        return res.status(201).json({
            id: user.id,
            username: user.username,
            fname: user.fname,
            lname: user.lname,
            clinic: user.clinic,
            role: user.role,
            token: generateToken(user.id)
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                id: user.id,
                username: user.username,
                fname: user.fname,
                lname: user.lname,
                clinic: user.clinic,
                role: user.role,
                token: generateToken(user.id)
            });
        } else {
            res.status(401).json({ message: 'Error 401: Username or password is invalid.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Error 404: User not found.' });
      }
  
      res.status(200).json({
        fname: user.fname,
        lname: user.lname,
        clinic: user.clinic,
        role: user.role,
        username: user.username,
        password: user.password,
      });
    } catch (error) {
        res.status(500).json({ message: 'Error 500: Server error.', error: error.message });
    }
};

const updateUser = async (req, res) => {
    const { username, password, fname, lname, clinic, role } = req.body;
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'Error 404: User not found.' });

        user.username = username || user.username;
        user.password = password || user.password;
        user.fname = fname || user.fname;
        user.lname = lname || user.lname;
        user.clinic = clinic || user.clinic;
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.json({
            id: updatedUser.id,
            fname: updatedUser.fname,
            lname: updatedUser.lname,
            clinic: updatedUser.clinic,
            role: updatedUser.role,
            username: updatedUser.username,
        });
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

module.exports = { registerUser, loginUser, getUser, updateUser, deleteUser };