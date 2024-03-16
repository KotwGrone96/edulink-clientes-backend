import express from 'express';

const app = express();

app.set('trust proxy', true);

app.get('/', (req, res) => {
	const ip = req.ip;
	console.log(ip); // ip address of the user
	res.send('Hola');
});

app.listen(3000, () => {
	console.log('Servidor abiertoen puerto 3000');
});
