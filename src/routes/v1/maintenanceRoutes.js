const router = require('express').Router();
const ctrl = require('../controllers/maintenanceController');
const validate = require('../middlewares/validate');
const { traiterSchema } = require('../validators/maintenanceValidator');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/alertes', ctrl.getAlertes);
router.get('/:id', ctrl.getById);
router.put('/:id/traiter', validate(traiterSchema), ctrl.traiter);
router.post('/verifier', ctrl.verifier);

module.exports = router;