require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Libera o acesso para a Vercel
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Banco Conectado'))
  .catch(err => console.error('❌ Erro Banco:', err));

// Esquemas
const Product = mongoose.model('Product', new mongoose.Schema({ nome: String, preco: Number, categoria: String, imagem_url: String }));
const Category = mongoose.model('Category', new mongoose.Schema({ nome: String }));
const Banner = mongoose.model('Banner', new mongoose.Schema({ imagem_url: String }));

// ROTAS (Tudo começando com /api/)
app.get('/api/products', async (req, res) => res.json(await Product.find()));
app.get('/api/categories', async (req, res) => res.json(await Category.find()));
app.get('/api/banners', async (req, res) => res.json(await Banner.find()));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));