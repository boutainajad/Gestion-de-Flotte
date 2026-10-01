const router = require('express').Router();
const ctrl = require('../controllers/camionController');
const validate = require('../middlewares/validate');
const { camionSchema } = require('../validators/ressourceValidator');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', validate(camionSchema), ctrl.create);
router.put('/:id', validate(camionSchema), ctrl.update);
router.delete('/:id', ctrl.archive);

module.exports = router;