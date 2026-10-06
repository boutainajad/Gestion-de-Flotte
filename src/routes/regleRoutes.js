const router = require('express').Router();
const ctrl = require('../controllers/regleController');
const validate = require('../middlewares/validate');
const { regleSchema } = require('../validators/maintenanceValidator');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/', ctrl.getAll);
router.post('/', validate(regleSchema), ctrl.create);
router.put('/:id', validate(regleSchema), ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;