const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descricao: { type: String, required: true }, // Mude para false se quiser deixar vazio
  preco: { type: Number, required: true },
  categoria: { type: String, required: true },
  estoque: { type: Number, required: true },
  imagem_url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', ProductSchema);