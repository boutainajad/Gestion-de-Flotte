const router = require('express').Router();
const ctrl = require('../controllers/remorqueController');
const validate = require('../middlewares/validate');
const { remorqueSchema } = require('../validators/ressourceValidator');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', validate(remorqueSchema), ctrl.create);
router.put('/:id', validate(remorqueSchema), ctrl.update);
router.delete('/:id', ctrl.archive);

module.exports = router;