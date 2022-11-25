import express from 'express';
const router = express.Router();

/* GET health check page. */
router.get('/', (req, res) => {
	res.status(200).json({
		status: 'OK',
	});
});

export default router;
