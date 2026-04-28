require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  {
    nome: "Hype Beast Hoodie",
    descricao: "Algodão 500GSM, corte oversized, roxo vibrante.",
    preco: 499.00,
    categoria: "Moletom",
    imagem_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
    estoque: 10
  },
  {
    nome: "Cyberpunk Tee",
    descricao: "Estampa refletiva com tecnologia de silk HD.",
    preco: 199.00,
    categoria: "Camisetas",
    imagem_url: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop",
    estoque: 25
  },
  {
    nome: "Drip Sneaker V1",
    descricao: "Solado tecnológico e acabamento em couro premium.",
    preco: 899.00,
    categoria: "Calçados",
    imagem_url: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1000&auto=format&fit=crop",
    estoque: 5
  }
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🚀 Conectado para o Seed...");
    
    await Product.deleteMany({}); // Limpa o banco antes de inserir
    await Product.insertMany(products);
    
    console.log("✅ Produtos inseridos com sucesso!");
    process.exit();
  } catch (err) {
    console.error("❌ Erro no seed:", err);
    process.exit(1);
  }
}

seedDB();