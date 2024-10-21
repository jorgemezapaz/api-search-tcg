const elasticSearchService = require('../services/elasticSearchService');

exports.createCard = async (req, res) => {
  const { name, type, rarity } = req.body;
  try {
    const response = await elasticSearchService.createCard({ name, type, rarity });
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: 'Error al crear la carta.' });
  }
};

exports.updateCard = async (req, res) => {
  const { id } = req.params;
  const { name, type, rarity } = req.body;
  try {
    const response = await elasticSearchService.updateCard(id, { name, type, rarity });
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: 'Error al actualizar la carta.' });
  }
};

exports.deleteCard = async (req, res) => {
  const { id } = req.params;
  try {
    const response = await elasticSearchService.deleteCard(id);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: 'Error al eliminar la carta.' });
  }
};

exports.bulkCreateCards = async (req, res) => {
  const cards = req.body.cards; 
  try {
    const response = await elasticSearchService.bulkCreateCards(cards);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: 'Error al guardar las cartas.' });
  }
};

exports.searchCards = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).send({ error: 'El parámetro de búsqueda "q" es requerido.' });
  }

  try {
    const results = await elasticSearchService.searchCards(q);
    res.status(200).send(results);
  } catch (error) { 
    console.error('Error details:', error); 
    res.status(500).send({ error: 'Error al buscar cartas.' });
  }
};