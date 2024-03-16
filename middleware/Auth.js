import { loadEnvVars } from './../env.js';

export const validateToken = (req, res, next) => {
	const env = loadEnvVars();

	if ('authorization' in req.headers == false) {
		return res.json({
			ok: false,
			message: 'No se envió cabecera de Authorization',
		});
	}
	const token = req.headers['authorization'].split('|');
	if (token.length < 2) {
		return res.json({
			ok: false,
			message: 'Token sin secreto',
		});
	}
	const [bearer, hash] = token;

	if (`${bearer}|${hash}` != `${env.SECRET_KEY}|${env.API_TOKEN}`) {
		return res.json({
			ok: false,
			message: 'Token inválido',
		});
	}
	next();
};
