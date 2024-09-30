import express from 'express';
import cors from 'cors';
import { router } from './router.js';
import {engine} from 'express-handlebars'
import {cwd} from 'process'
import {join} from 'path';
import { Server } from "socket.io";
import { createServer } from 'http';

export const createWebServer = () => {
	const app = express();
	app.engine('.hbs',engine({
		extname:'.hbs',
	}))
	app.set('view engine','.hbs')
	app.set('views', join(cwd(),'views'))
	app.use(cors());
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(router);

	const httpServer = createServer(app)

	const io = new Server(httpServer,{
		path:'/ws',
		cors:{
			origin:['https://clientes.edulink.la','http://edulink.clientes-dev.com','https://dev-clientes.edulink.la']
		}
	})

	io.on('connection',(socket)=>{
		console.log('Nuevo usuario',socket.id)
		socket.on('disconnect',(reason)=>{	
			console.log('Desconectado', reason)
		})
		socket.on('generate notification',(msg)=>{
			socket.broadcast.emit('front notification',msg)
		})
	})

	return httpServer;
};
