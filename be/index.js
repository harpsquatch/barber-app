require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Barber app backend is running!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
}); 