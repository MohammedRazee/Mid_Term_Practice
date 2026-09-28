import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/about', (req, res) => {
  res.send('This is the About page.');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:3000`);
});