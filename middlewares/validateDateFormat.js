import moment from 'moment';

// Middleware to validate date format "YY-MM-DD"
function validateDateFormat(req, res, next) {
  const dateParam = req.params.date; // Assuming the date is in the route parameters

  if (!dateParam || !moment(dateParam, 'YY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Invalid date format. Please use "YY-MM-DD".' });
  }

  next();
}

export default validateDateFormat;