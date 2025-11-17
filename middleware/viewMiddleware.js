module.exports = (req, res, next) => {
  try {
    res.locals.csrfToken = typeof req.csrfToken === "function" ? req.csrfToken() : null;
  } catch {
    res.locals.csrfToken = null;
  }
  next();
};
