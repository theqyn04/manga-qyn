const passport = require('passport');

const auth = passport.authenticate('jwt', { session: false, failWithError: true });

// Error handling wrapper
const authMiddleware = (req, res, next) => {
    auth(req, res, (err) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized', error: err.message });
        }
        next();
    });
};

module.exports = authMiddleware;