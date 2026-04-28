require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2; // Versão 2 garantida

const app = express(); // <--- INICIALIZAÇÃO PRIMEIRO!

// --- 1. CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
app.use(cors({
    origin: 'https://est1lo.vercel.app/', // No deploy final, você pode trocar '*' pelo link da Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// --- 2. CONEXÃO COM BANCO DE DADOS (MongoDB Atlas) ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado ao MongoDB Atlas'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// --- 3. CONFIGURAÇÃO CLOUDINARY (Upload de Imagens) ---
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'estilo-da-ilha',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});
const upload = multer({ storage });

// --- 4. MODELOS DO BANCO ---
const Product = mongoose.model('Product', new mongoose.Schema({
  nome: String, preco: Number, estoque: Number, categoria: String, descricao: String, imagem_url: String, createdAt: { type: Date, default: Date.now }
}));

const Category = mongoose.model('Category', new mongoose.Schema({ nome: String }));

const Banner = mongoose.model('Banner', new mongoose.Schema({ imagem_url: String }));

const Order = mongoose.model('Order', new mongoose.Schema({
  numero: String, cliente: { nome: String, telefone: String }, itens: Array, total: Number, entrega: String, pagamento: String, status: String, createdAt: { type: Date, default: Date.now }
}));

// --- 5. ROTAS DA API ---

// Produtos
app.get('/api/products', async (req, res) => res.json(await Product.find().sort({ createdAt: -1 })));
app.post('/api/products', upload.single('image'), async (req, res) => {
  const p = new Product({ ...req.body, imagem_url: req.file.path });
  await p.save();
  res.json(p);
});
app.delete('/api/products/:id', async (req, res) => { await Product.findByIdAndDelete(req.params.id); res.json({ msg: 'Removido' }); });

// Categorias
app.get('/api/categories', async (req, res) => res.json(await Category.find()));
app.post('/api/categories', async (req, res) => { const c = new Category(req.body); await c.save(); res.json(c); });
app.delete('/api/categories/:id', async (req, res) => { await Category.findByIdAndDelete(req.params.id); res.json({ msg: 'Removida' }); });

// Banners
app.get('/api/banners', async (req, res) => res.json(await Banner.find()));
app.post('/api/banners', upload.single('image'), async (req, res) => {
  const b = new Banner({ imagem_url: req.file.path });
  await b.save();
  res.json(b);
});
app.delete('/api/banners/:id', async (req, res) => { await Banner.findByIdAndDelete(req.params.id); res.json({ msg: 'Removido' }); });

// Pedidos
app.post('/api/orders', async (req, res) => { const o = new Order(req.body); await o.save(); res.json(o); });

// --- 6. INICIALIZAÇÃO DO SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor da Ilha rodando na porta ${PORT}`);
});