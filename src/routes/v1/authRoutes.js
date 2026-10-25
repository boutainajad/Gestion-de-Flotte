const router = require('express').Router();
const ctrl = require('../../controllers/authController');
const validate = require('../../middlewares/validate');
const { registerSchema, loginSchema } = require('../../validators/authValidator');
const { authenticate, authorize } = require('../../middlewares/auth');

router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);

router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

router.get('/admin-only', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Bienvenue Admin 👑' });
});

module.exports = router;