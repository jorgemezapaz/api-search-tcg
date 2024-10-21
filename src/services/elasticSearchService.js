const elastic = require('elasticsearch');

const client = new elastic.Client({
  host: 'https://16q48yv32h:ncdvrc3w4j@elastic-5639189895.us-east-1.bonsaisearch.net:443', 
  log: 'trace'
});

exports.createCard = async (card) => {
  return await client.index({
    index: 'cards',
    body: card,
  });
};

exports.updateCard = async (id, card) => {
  return await client.update({
    index: 'cards',
    id,
    body: {
      doc: card,
    },
  });
};

exports.deleteCard = async (id) => {
  return await client.delete({
    index: 'cards',
    id,
  });
};

exports.bulkCreateCards = async (cards) => {
  const body = cards.flatMap(card => [{ index: { _index: 'cards' } }, card]);
  return await client.bulk({ body });
};

exports.searchCards = async (q) => {
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

  const response = await client.search(esQuery);
  return response.hits.hits.map(hit => hit._source);
};