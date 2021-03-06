import * as actionTypes from './actionTypes';
import jwt from 'jsonwebtoken';
import axiosAPI from '../../helpers/axiosAPI';
import querystring from 'querystring';
import moment from 'moment';

export const refreshExpenses = () => {
  return (dispatch) => {
    dispatch({
      type: actionTypes.REFRESH_EXPENSES,
    });
  };
};

/**
 * Get the expenses for the current user that follow the specified options
 * like sort order, sort criteria, start date, end date, etc.
 *
 * @param {Object} options
 */
export const getUserExpenses = (options) => {
  return (dispatch) => {
    // decocode jwt to get username
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    if (!options.group_id) delete options['group_id'];

    // construct query params from options
    let query = '';
    if (options) {
      query = '?' + querystring.stringify(options);
    }

    // make request for user expenses with query params
    return axiosAPI
      .get('/users/' + username + '/expenses' + query)
      .then((res) => {
        dispatch({
          type: actionTypes.GET_USER_EXPENSES,
        });
        return res.data;
      })
      .catch((err) => {
        // TODO
      });
  };
};

/**
 * Adds expense for the user
 * @param {Object} expense
 */
export const addNewExpense = (expense) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    // get user_id
    return axiosAPI
      .get('/users/' + username)
      .then((res) => {
        expense.user_id = res.data._id;
        expense.date = moment(expense.date).format('YYYY/MM/DD');
        expense.category = expense.category || 'Other';
        axiosAPI
          .post('/expenses', expense)
          .then((res) => {
            dispatch({
              type: actionTypes.ADD_NEW_EXPENSE,
            });
          })
          .catch((err) => {
            // TODO
          });
      })
      .catch((err) => {
        // TODO
      });
  };
};

/**
 * Edits an expense for the user
 * @param {Object} expense
 */
export const editExpense = (expense) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    if (!expense.group_id) delete expense['group_id'];
    if (!expense.description) delete expense['description'];
    expense.date = moment(expense.date).format('YYYY/MM/DD');
    expense.category = expense.category || 'Other';

    return axiosAPI
      .put('/expenses/' + expense._id, expense)
      .then((res) => {
        dispatch({
          type: actionTypes.EDIT_EXPENSE,
        });
      })
      .catch((err) => {
        //TODO
      });
  };
};

export const deleteExpense = (expenseId) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    return axiosAPI
      .delete('/expenses/' + expenseId)
      .then((res) => {
        dispatch({
          type: actionTypes.DELETE_EXPENSE,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};

export const getUserCategories = () => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    return axiosAPI
      .get('/users/' + username + '/expenses/categories')
      .then((res) => {
        dispatch({
          type: actionTypes.GET_USER_CATEGORIES,
          categories: res.data.categories.map((category) => category.name),
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};

export const getCategoryAmounts = (options) => {
  return (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;
    const username = jwt.decode(token).user.username;

    let query = '';
    if (options) {
      query = '&' + querystring.stringify(options);
    }

    return axiosAPI
      .get('/users/' + username + '/expenses/categories?amounts=true' + query)
      .then((res) => {
        dispatch({
          type: actionTypes.GET_CATEGORY_AMOUNTS,
          categoryAmounts: res.data.categories,
        });
      })
      .catch((err) => {
        // TODO
      });
  };
};

const getTotal = (dispatch, period, date) => {
  if (period !== 'month' && period !== 'year') return;
  const token = localStorage.getItem('accessToken');
  if (!token) return;
  const username = jwt.decode(token).user.username;

  let dateQuery =
    '?' +
    querystring.stringify({
      start_date: moment(new Date(date)).startOf(period).format('YYYY/MM/DD'),
      end_date: moment(new Date(date)).endOf(period).format('YYYY/MM/DD'),
    });

  let type = actionTypes.GET_MONTHLY_TOTAL;
  if (period === 'year') type = actionTypes.GET_YEARLY_TOTAL;

  return axiosAPI
    .get('/users/' + username + '/expenses' + dateQuery)
    .then((res) => {
      dispatch({
        type: type,
        [period + 'lyTotal']: res.data.totalAmount,
      });
      return res.data.totalAmount;
    })
    .catch((err) => {
      // TODO
    });
};

export const getMonthlyTotal = (date) => {
  return (dispatch) => {
    return getTotal(dispatch, 'month', date);
  };
};

export const getYearlyTotal = (date) => {
  return (dispatch) => getTotal(dispatch, 'year', date);
};
