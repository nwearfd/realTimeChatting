const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Message = require('../models/Message');

// GET /api/messages/:room  -> 메시지 로드 (인증 필요)
router.get('/:room', auth, async (req, res) => {
    const { room } = req.params;
    try {
        const messages = await Message.find({ room }).sort({ createdAt: 1 }).limit(100);
        res.json(messages);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

module.exports = router;
