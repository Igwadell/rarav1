const express = require('express');
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const router = express.Router();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Get all bookings for current user
router.get('/', authMiddleware, async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate('listing');
  res.json(bookings);
});

// Get booking by id
router.get('/:id', authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('listing');
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  res.json(booking);
});

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  const { listing, startDate, endDate, total } = req.body;
  const booking = await Booking.create({
    listing,
    user: req.user.id,
    startDate,
    endDate,
    total,
  });
  res.status(201).json(booking);
});

// Update booking
router.put('/:id', authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  Object.assign(booking, req.body);
  await booking.save();
  res.json(booking);
});

// Delete booking
router.delete('/:id', authMiddleware, async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  await booking.deleteOne();
  res.json({ message: 'Booking deleted' });
});

module.exports = router; 