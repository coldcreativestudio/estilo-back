const Product = require('../models/Product');

module.exports = {
  // Lista todos os produtos
  async index(req, res) {
    try {
      const products = await Product.find().sort('-createdAt');
      return res.json(products);
    } catch (err) {
      console.error("❌ Erro ao listar produtos:", err);
      return res.status(500).json({ error: 'Erro no servidor ao buscar produtos.' });
    }
  },

  // Busca um produto específico (Página de Detalhes)
  async show(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ error: 'Produto não encontrado.' });
      return res.json(product);
    } catch (err) {
      console.error("❌ Erro ao buscar produto:", err);
      return res.status(400).json({ error: 'ID de produto inválido.' });
    }
  },

  // Cria um novo produto
  async store(req, res) {
    try {
      if (!req.file) return res.status(400).json({ error: 'A foto do produto é obrigatória.' });

      const { nome, descricao, preco, categoria, estoque } = req.body;

      const product = await Product.create({
        nome,
        descricao,
        preco: Number(preco),
        categoria,
        estoque: Number(estoque),
        imagem_url: req.file.path
      });

      console.log("✅ Produto lançado com sucesso:", product.nome);
      return res.status(201).json(product);
    } catch (err) {
      console.error("❌ Erro ao lançar produto:", err);
      return res.status(400).json({ error: 'Erro ao cadastrar produto.', details: err.message });
    }
  },

  // Deleta um produto
  async delete(req, res) {
    try {
      await Product.findByIdAndDelete(req.params.id);
      return res.json({ message: "Removido da ilha com sucesso." });
    } catch (err) {
      console.error("❌ Erro ao deletar:", err);
      return res.status(400).json({ error: 'Erro ao remover produto.' });
    }
  }
};