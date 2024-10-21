const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');

router.post('/', cardController.createCard);
router.put('/:id', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);
router.post('/bulk', cardController.bulkCreateCards);
router.get('/', cardController.searchCards);

module.exports = router;