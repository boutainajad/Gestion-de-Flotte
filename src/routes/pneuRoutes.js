const router = require('express').Router();
const ctrl = require('../controllers/pneuController');
const validate = require('../middlewares/validate');
const { pneuSchema } = require('../validators/ressourceValidator');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', validate(pneuSchema), ctrl.create);
router.put('/:id', validate(pneuSchema), ctrl.update);
router.delete('/:id', ctrl.remove);
router.patch('/:id/associer', ctrl.associerCamion);

module.exports = router;