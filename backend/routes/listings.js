const express = require('express');
const Listing = require('../models/Listing');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to check JWT
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

// Get all listings
router.get('/', async (req, res) => {
  const listings = await Listing.find().populate('host', 'email firstName lastName');
  res.json(listings);
});

// Get listing by id
router.get('/:id', async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('host', 'email firstName lastName');
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  res.json(listing);
});

// Create listing (auth required)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, price, location, images } = req.body;
  const listing = await Listing.create({
    title,
    description,
    price,
    location,
    images,
    host: req.user.id,
  });
  res.status(201).json(listing);
});

// Update listing (auth required)
router.put('/:id', authMiddleware, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (listing.host.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  Object.assign(listing, req.body);
  await listing.save();
  res.json(listing);
});

// Delete listing (auth required)
router.delete('/:id', authMiddleware, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ message: 'Listing not found' });
  if (listing.host.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
  await listing.deleteOne();
  res.json({ message: 'Listing deleted' });
});

module.exports = router; 