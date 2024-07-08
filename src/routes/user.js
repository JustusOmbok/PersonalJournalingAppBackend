const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getManager } = require('typeorm');
const User = require('../entity/User');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();
your_secret_key = 34293560;

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userRepository = getManager().getRepository('User');
    const user = userRepository.create({
      username,
      password: hashedPassword
    });
    await userRepository.save(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'User registration failed', error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userRepository = getManager().getRepository('User');
    const user = await userRepository.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
});

router.get('/profile', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  try {
    const userRepository = getManager().getRepository('User');
    const user = await userRepository.findOne(userId, { select: ['id', 'username'] });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
});

router.put('/profile', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const userRepository = getManager().getRepository('User');
    await userRepository.update(userId, { username, password: hashedPassword });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error });
  }
});

module.exports = router;
