const express = require('express');
const cardRoutes = require('./src/routes/cardRoute');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/cards', cardRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

