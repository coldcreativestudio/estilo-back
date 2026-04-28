const { Router } = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

const ProductController = require('../controllers/ProductController');
const Category = require('../models/Category');
const Banner = require('../models/Banner');

const routes = Router();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: 'estilo_da_ilha' }
});

const upload = multer({ storage });

// ROTAS DE PRODUTOS
routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show); // Linha que causou o crash corrigida
routes.post('/products', upload.single('image'), ProductController.store);
routes.delete('/products/:id', ProductController.delete);

// ROTAS DE CATEGORIAS
routes.get('/categories', async (req, res) => {
    try {
        const cats = await Category.find();
        res.json(cats);
    } catch (err) { res.status(500).send(err); }
});

routes.post('/categories', async (req, res) => {
    try {
        const cat = await Category.create(req.body);
        res.json(cat);
    } catch (err) { res.status(400).send(err); }
});

routes.delete('/categories/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ msg: "Removida" });
    } catch (err) { res.status(400).send(err); }
});

// ROTAS DE BANNERS
routes.get('/banners', async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (err) { res.status(500).send(err); }
});

routes.post('/banners', upload.single('image'), async (req, res) => {
    try {
        const banner = await Banner.create({ imagem_url: req.file.path });
        res.json(banner);
    } catch (err) { res.status(400).send(err); }
});

routes.delete('/banners/:id', async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ msg: "Banner removido" });
    } catch (err) { res.status(400).send(err); }
});

module.exports = routes;