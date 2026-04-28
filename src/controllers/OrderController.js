const Order = require('../models/Order');

module.exports = {
  async store(req, res) {
    try {
      const { cliente, itens, total, entrega, pagamento, observacoes } = req.body;

      // Gerar número do pedido: #PED-20260426-001
      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
      const count = await Order.countDocuments({
        createdAt: { 
          $gte: new Date(today.setHours(0,0,0,0)), 
          $lt: new Date(today.setHours(23,59,59,999)) 
        }
      });
      
      const orderNumber = `#PED-${dateStr}-${(count + 1).toString().padStart(3, '0')}`;

      const order = await Order.create({
        orderNumber,
        cliente,
        itens,
        total,
        entrega,
        pagamento,
        observacoes
      });

      return res.status(201).json(order);
    } catch (err) {
      console.error(err);
      return res.status(400).json({ error: 'Erro ao gerar pedido' });
    }
  },

  async index(req, res) {
    const orders = await Order.find().sort('-createdAt');
    return res.json(orders);
  }
};