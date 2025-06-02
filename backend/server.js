const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}


const dataRoutes = require('./routes/dataRoutes');
app.use('/api/data', dataRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/user', userRoutes);


app.post('/logout', (req, res) => {
  res.send({ message: 'Çıkış başarılı.' });
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`));
