import { Router } from 'express';
import { PropertyController } from '../controllers/properties/PropertyController';

const router = Router();
const propertyController = new PropertyController();

// Public routes
router.get('/', propertyController.getAllProperties);
router.get('/featured', propertyController.getFeaturedProperties);
router.get('/city/:city', propertyController.getPropertiesByCity);
router.get('/:id', propertyController.getPropertyById);

// Broker routes (for broker portal - will add auth middleware later)
router.post('/', propertyController.createProperty);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

export default router;
