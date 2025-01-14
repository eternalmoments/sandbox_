import express from 'express';
import auth from '../middleware/auth.js';
import Site from '../models/Site.js';

const router = express.Router();

// Create site
router.post('/', auth, async (req, res) => {
  try {
    const { title, meetingDate, messages } = req.body;
    const site = new Site({
      userId: req.user.userId,
      title,
      meetingDate,
      messages
    });
    await site.save();
    res.status(201).json(site);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's sites
router.get('/', auth, async (req, res) => {
  try {
    const sites = await Site.find({ userId: req.user.userId });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update site
router.put('/:id', auth, async (req, res) => {
  try {
    const site = await Site.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.json(site);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete site
router.delete('/:id', auth, async (req, res) => {
  try {
    const site = await Site.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }
    res.json({ message: 'Site deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;