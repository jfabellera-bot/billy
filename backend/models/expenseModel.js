const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    user_id: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    group_id: {
      type: mongoose.Types.ObjectId,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model('expenses', expenseSchema);

module.exports = Expense;
