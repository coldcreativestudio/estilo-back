const mongoose = require('mongoose');
const BannerSchema = new mongoose.Schema({
  imagem_url: { type: String, required: true }
});
module.exports = mongoose.model('Banner', BannerSchema);