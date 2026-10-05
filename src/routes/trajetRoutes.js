const router = require('express').Router();
const ctrl = require('../controllers/trajetController');
const validate = require('../middlewares/validate');
const {
  trajetSchema, assignationSchema,
  kmDepartSchema, kmArriveeSchema
} = require('../validators/trajetValidator');
const { authenticate, authorize } = require('../middlewares/auth');

router.use(authenticate);

router.get('/mes-trajets', authorize('chauffeur'), ctrl.getMesTrajets);

router.patch('/:id/km-depart',
  authorize('chauffeur'),
  validate(kmDepartSchema),
  ctrl.saisirKmDepart
);

router.patch('/:id/km-arrivee',
  authorize('chauffeur'),
  validate(kmArriveeSchema),
  ctrl.saisirKmArrivee
);

router.get('/', authorize('admin'), ctrl.getAll);
router.get('/:id', authorize('admin'), ctrl.getById);
router.post('/', authorize('admin'), validate(trajetSchema), ctrl.create);
router.put('/:id/assigner', authorize('admin'), validate(assignationSchema), ctrl.assigner);

module.exports = router;