const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  numero: { type: String, required: true },
  cliente: {
    nome: String,
    telefone: String,
    email: String
  },
  itens: Array,
  total: Number,
  entrega: String,
  pagamento: String,
  observacoes: String,
  status: { type: String, default: 'novo' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);