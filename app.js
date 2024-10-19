const express = require('express');
const { Client } = require('@elastic/elasticsearch');

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client({ node: process.env.ELASTICSEARCH_HOST });

// CRUD operations
app.post('/cards', async (req, res) => {
  const { name, type, rarity } = req.body;
  const response = await client.index({
    index: 'pokemon_cards',
    body: { name, type, rarity },
  });
  res.send(response);
});

app.get('/cards/:id', async (req, res) => {
  const { id } = req.params;
  const response = await client.get({
    index: 'pokemon_cards',
    id,
  });
  res.send(response.body);
});

app.put('/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, rarity } = req.body;
  const response = await client.update({
    index: 'pokemon_cards',
    id,
    body: {
      doc: { name, type, rarity },
    },
  });
  res.send(response);
});

app.delete('/cards/:id', async (req, res) => {
  const { id } = req.params;
  const response = await client.delete({
    index: 'pokemon_cards',
    id,
  });
  res.send(response);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
