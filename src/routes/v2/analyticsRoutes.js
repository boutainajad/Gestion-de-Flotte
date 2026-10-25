const router = require('express').Router();
const ctrl = require('../../controllers/analyticsController');
const { authenticate, authorize } = require('../../middlewares/auth');

router.use(authenticate, authorize('admin'));

router.get('/drivers/eco-performance', ctrl.ecoPerformance);
router.get('/tires/health-matrix', ctrl.tiresHealthMatrix);
router.get('/trips/financial-esg', ctrl.financialEsg);
router.get('/fleet/utilization-trends', ctrl.getFleetUtilization);

module.exports = router;