import { Router } from 'express';
import AreaRouter from './routes/AreasRouter.js'
import UserRouter from './routes/UsersRouter.js'
import CostumersRouter from './routes/CostumersRouter.js'
import ContactsInfoRouter from './routes/ContactsInfoRouter.js'
import SalesRouter from './routes/SalesRouter.js'
import CostCenterRouter from './routes/CostCenterRouter.js'
import EmailRouter from './routes/EmailRouter.js'
import RouteRouter from './routes/RoutesRouter.js'

const router = Router();


//*** API ***//

//AREAS
router.use('/api',AreaRouter)

//USERS
router.use('/api',UserRouter)

//COSTUMERS
router.use('/api',CostumersRouter)

//CONTACT INFO COSTUMERS
router.use('/api',ContactsInfoRouter)

//SALES
router.use('/api',SalesRouter)

//COST CENTER
router.use('/api',CostCenterRouter)

//EMAILS
router.use('/api',EmailRouter)

//RUTAS
router.use('/api',RouteRouter)


// // OPORTUNITIES
// router.get('/api/oportunity/all', validateToken, (req, res) =>
// 	oportunityController.findAll(req, res)
// );
// router.get('/api/oportunity/all/:costumer_id', validateToken, (req, res) =>
// 	oportunityController.findAll(req, res)
// );

// router.get('/api/oportunity/find/:id', validateToken, (req, res) =>
// 	oportunityController.findOne(req, res)
// );

// router.post('/api/oportunity/create', validateToken, (req, res) =>
// 	oportunityController.create(req, res)
// );

// router.put('/api/oportunity/update', validateToken, (req, res) =>
// 	oportunityController.update(req, res)
// );

// router.put('/api/oportunity/updateToSaleClosed', validateToken, (req, res) =>
// 	oportunityController.updateToSaleClosed(req, res)
// );

// router.delete('/api/oportunity/delete/:id', validateToken, (req, res) =>
// 	oportunityController.delete(req, res)
// );

// // SALES CLOSED
// router.get('/api/saleClosed/all', validateToken, (req, res) =>
// 	saleClosedController.findAll(req, res)
// );
// router.get('/api/saleClosed/all/:costumer_id', validateToken, (req, res) =>
// 	saleClosedController.findAll(req, res)
// );

// router.get('/api/saleClosed/find/:id', validateToken, (req, res) =>
// 	saleClosedController.findOne(req, res)
// );

// router.post('/api/saleClosed/create', validateToken, (req, res) =>
// 	saleClosedController.create(req, res)
// );

// router.put('/api/saleClosed/update', validateToken, (req, res) =>
// 	saleClosedController.update(req, res)
// );

// router.delete('/api/saleClosed/delete/:id', validateToken, (req, res) =>
// 	saleClosedController.delete(req, res)
// );

// //TEST
// router.post('/api/notification', async (req, res) => {
// 	try {
// 		const payload = {
// 			title: 'Mi notificación',
// 			message: 'Hola edulink!!!',
// 		};

// 		await webpush.sendNotification(req.body, JSON.stringify(payload));
// 	} catch (error) {
// 		console.log(error);
// 		return res.json({ ok: false, message: 'Error en el servidor' });
// 	}
// });

export { router };
