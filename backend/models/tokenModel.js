const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    refresh_token: {
      type: String,
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

tokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Token = mongoose.model('refresh_tokens', tokenSchema);

module.exports = Token;
