const jwt = require('jsonwebtoken');
const config = require('../../config');

const User = require('../../models/userModel');
const Expense = require('../../models/expenseModel');

auth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401);

  try {
    // verify token
    jwt.verify(token, config.jwt_access_secret, (err, decoded) => {
      if (err) return res.sendStatus(401);

      User.findOne({ username: decoded.user.username }, (userErr, user) => {
        Expense.findOne(
          { _id: req.params.expense_id },
          (expenseErr, expense) => {
            if (userErr || expenseErr || !user) return res.sendSatus(401);

            // add user from payload
            req.user = user;

            // If username is in the URL, confirm token auth
            if (req.params.username && req.params.username !== user.username)
              return res.sendStatus(401);

            // If user_id is in the body, confirm token auth
            if (req.body.user_id && req.body.user_id !== user._id)
              return res.sendStatus(401);

            // If expense_id is in the URL, confirm token auth (check expense owner)
            if (req.params.expense_id) {
              if (!expense) return res.sendStatus(401);
              if (String(expense.user_id) !== String(user._id)) {
                return res.sendStatus(401);
              }
            }

            next();
          }
        );
      });
    });
  } catch (e) {
    return res.sendStatus(401);
  }
};

module.exports = auth;