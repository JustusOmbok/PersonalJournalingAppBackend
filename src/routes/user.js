import { Router } from 'express';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { getManager } from 'typeorm';
import User from '../entity/User';
import { authenticateJWT } from '../middleware/auth';

const router = Router();
const secretKey = process.env.JWT_SECRET || '34293560';

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await hash(password, 10);

  try {
    const userRepository = getManager().getRepository(User);
    const user = userRepository.create({
      username,
      password: hashedPassword
    });
    await userRepository.save(user);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ message: 'User registration failed', error });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne({ where: { username } });

    if (user && await compare(password, user.password)) {
      const token = sign({ userId: user.id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error });
  }
});

router.get('/profile', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  try {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOne(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error('Fetch profile error:', error);
    res.status(500).json({ message: 'Failed to fetch profile', error });
  }
});

router.put('/profile/update', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const { username, password } = req.body;
  const hashedPassword = await hash(password, 10);

  try {
    const userRepository = getManager().getRepository(User);
    await userRepository.update(userId, { username, password: hashedPassword });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error });
  }
});

export default router;
