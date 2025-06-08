import User from '../models/User.js';

export const getTestHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('testAttempts');
    res.json(user.testAttempts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch test history' });
  }
};
