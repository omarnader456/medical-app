const viewMiddleware = (req, res, next) => {
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }
    next();
};

module.exports = viewMiddleware;