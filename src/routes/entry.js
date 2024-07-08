const express = require('express');
const { getRepository } = require('typeorm');
const Entry = require('../entity/Entry');
const User = require('../entity/User');
const { authenticateJWT } = require('../middleware/auth');

const router = express.Router();

// Create entry
router.post('/', authenticateJWT, async (req, res) => {
  const { title, content, category, date } = req.body;
  const userId = req.user.userId;

  try {
    const entryRepository = getRepository(Entry);
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const entry = entryRepository.create({
      title,
      content,
      category,
      date: new Date(date),
      user
    });

    await entryRepository.save(entry);
    res.status(201).json({ message: 'Entry created successfully' });
  } catch (error) {
    console.error('Failed to create entry', error);
    res.status(500).json({ message: 'Failed to create entry', error: error.message });
  }
});

// Fetch user's entries
router.get('/', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;

  try {
    const entryRepository = getRepository(Entry);
    const entries = await entryRepository.find({ where: { user: { id: userId } } });
    res.status(200).json(entries);
  } catch (error) {
    console.error('Failed to fetch entries', error);
    res.status(500).json({ message: 'Failed to fetch entries', error: error.message });
  }
});

// Fetch entry by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const entryId = req.params.id;

  try {
    const entryRepository = getRepository(Entry);
    const entry = await entryRepository.findOne({ where: { id: entryId, user: { id: userId } } });
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error('Failed to fetch entry', error);
    res.status(500).json({ message: 'Failed to fetch entry', error: error.message });
  }
});

// Update entry
router.put('/:id', authenticateJWT, async (req, res) => {
  const { title, content, category, date } = req.body;
  const userId = req.user.userId;
  const entryId = req.params.id;

  try {
    const entryRepository = getRepository(Entry);
    const result = await entryRepository.update({ id: entryId, user: { id: userId } }, { title, content, category, date: new Date(date) });
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry updated successfully' });
  } catch (error) {
    console.error('Failed to update entry', error);
    res.status(500).json({ message: 'Failed to update entry', error: error.message });
  }
});

// Delete entry
router.delete('/:id', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const entryId = req.params.id;

  try {
    const entryRepository = getRepository(Entry);
    const result = await entryRepository.delete({ id: entryId, user: { id: userId } });
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error('Failed to delete entry', error);
    res.status(500).json({ message: 'Failed to delete entry', error: error.message });
  }
});

// Fetch entry summary by period (daily, weekly, monthly)
router.get('/summary/:period', authenticateJWT, async (req, res) => {
  const userId = req.user.userId;
  const period = req.params.period;
  let query;

  try {
    const entryRepository = getRepository(Entry);

    if (period === 'daily') {
      query = await entryRepository.createQueryBuilder('entry')
        .select('DATE(entry.date)', 'date')
        .addSelect('COUNT(*)', 'count')
        .where('entry.user.id = :userId', { userId })
        .groupBy('DATE(entry.date)')
        .getRawMany();
    } else if (period === 'weekly') {
      query = await entryRepository.createQueryBuilder('entry')
        .select('YEAR(entry.date)', 'year')
        .addSelect('WEEK(entry.date)', 'week')
        .addSelect('COUNT(*)', 'count')
        .where('entry.user.id = :userId', { userId })
        .groupBy('YEAR(entry.date), WEEK(entry.date)')
        .getRawMany();
    } else if (period === 'monthly') {
      query = await entryRepository.createQueryBuilder('entry')
        .select('YEAR(entry.date)', 'year')
        .addSelect('MONTH(entry.date)', 'month')
        .addSelect('COUNT(*)', 'count')
        .where('entry.user.id = :userId', { userId })
        .groupBy('YEAR(entry.date), MONTH(entry.date)')
        .getRawMany();
    } else {
      return res.status(400).json({ message: 'Invalid period' });
    }

    res.status(200).json(query);
  } catch (error) {
    console.error('Failed to fetch summary', error);
    res.status(500).json({ message: 'Failed to fetch summary', error: error.message });
  }
});

module.exports = router;
