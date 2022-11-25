import express from 'express';
import authenticationMiddleware from '../middlewares/authenticationMiddleware.js';
const router = express.Router();

/* GET user info */

router.use(authenticationMiddleware);

router.get('/', (req, res) => {
	res.status(200).json({
		user: req.user,
	});
});

export default router;
