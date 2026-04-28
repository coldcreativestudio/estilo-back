require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// No seu backend (server.js)
// No seu backend (server.js)
const cors = require('cors');

app.use(cors({
  origin: 'https://est1lo.vercel.app/' // Coloque aqui o link que a Vercel te deu
}));
const routes = require('./routes/productRoutes');

const app = express();

// Conexão com o Banco de Dados
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Conectado com sucesso'))
  .catch(err => console.error('❌ Erro ao conectar no MongoDB:', err));

app.use(cors());
app.use(express.json());
app.use('/api', routes); // Prefixo para todas as rotas

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`⚡ DRIP API rodando na porta ${PORT}`);
});