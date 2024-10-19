const express = require('express');
const { Client } = require('@elastic/elasticsearch');

const app = express();
const port = 3000;

app.use(express.json());

const client = new Client({ node: process.env.ELASTICSEARCH_HOST });

app.post('/cards', async (req, res) => {
  const { name, type, rarity } = req.body;
  const response = await client.index({
    index: 'cards',
    body: { name, type, rarity },
  });
  res.send(response);
});

app.put('/cards/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, rarity } = req.body;
  const response = await client.update({
    index: 'cards',
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
    index: 'cards',
    id,
  });
  res.send(response);
});

app.post('/cards/bulk', async (req, res) => {
    const cards = req.body.cards; 
    
    if (!Array.isArray(cards)) {
      return res.status(400).send({ error: 'Se espera un arreglo de cartas.' });
    }
  
    const body = cards.flatMap(card => [{ index: { _index: 'cards' } }, card]);
  
    try {
      const response = await client.bulk({ body });
      res.send(response.body);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error al guardar las cartas.' });
    }
  });

  app.get('/cards', async (req, res) => {
    const { q } = req.query;
  
    if (!q) {
      return res.status(400).send({ error: 'El parámetro de búsqueda "q" es requerido.' });
    }
  
    const esQuery = {
      index: 'cards',
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: q,
                  fields: ['name', 'code', 'type', 'category'], 
                  fuzziness: 'AUTO' 
                }
              },
              {
                wildcard: {
                  name: `*${q}*`
                }
              },
              {
                wildcard: {
                  code: `*${q}*` 
                }
              },
              {
                wildcard: {
                  type: `*${q}*` 
                }
              },
              {
                wildcard: {
                  category: `*${q}*` 
                }
              }
            ]
          }
        }
      }
    };
  
    try {
      const response = await client.search(esQuery);
      const results = response.body.hits.hits.map(hit => hit._source);
      res.send(results);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Error al buscar cartas.' });
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
