module.exports = (req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.csrfToken;
  try {
    if (typeof req.csrfToken === 'function') {
      res.locals.csrfToken = req.csrfToken();
    } else {
      res.locals.csrfToken = null;
    }
  } catch (err) {
    res.locals.csrfToken = null;
  }

  next();
};
