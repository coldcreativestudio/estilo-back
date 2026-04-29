require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Conectado'))
  .catch(err => console.error('❌ Erro Banco:', err));

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'estilo_ilha', allowed_formats: ['jpg', 'png', 'jpeg', 'webp'] }
});
const upload = multer({ storage });

const Product = mongoose.model('Product', new mongoose.Schema({
  nome: String, preco: Number, estoque: Number, categoria: String, descricao: String, imagem_url: String, createdAt: { type: Date, default: Date.now }
}));
const Category = mongoose.model('Category', new mongoose.Schema({ nome: String }));
const Banner = mongoose.model('Banner', new mongoose.Schema({ imagem_url: String }));

app.get('/api/products', async (req, res) => res.json(await Product.find().sort({ createdAt: -1 })));
app.post('/api/products', upload.single('image'), async (req, res) => {
  const p = new Product({ ...req.body, imagem_url: req.file.path });
  await p.save(); res.json(p);
});
app.get('/api/categories', async (req, res) => res.json(await Category.find()));
app.post('/api/categories', async (req, res) => { const c = new Category(req.body); await c.save(); res.json(c); });
app.get('/api/banners', async (req, res) => res.json(await Banner.find()));
app.post('/api/banners', upload.single('image'), async (req, res) => {
  const b = new Banner({ imagem_url: req.file.path });
  await b.save(); res.json(b);
});
app.post('/api/orders', async (req, res) => { 
    const Order = mongoose.model('Order', new mongoose.Schema({numero:String,cliente:Object,itens:Array,total:Number}));
    const o = new Order(req.body); 
    await o.save(); 
    res.json(o); 
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor na porta ${PORT}`));