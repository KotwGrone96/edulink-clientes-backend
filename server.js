import express from 'express';
import cors from 'cors';
import { router } from './router.js';
import {engine} from 'express-handlebars'
import {cwd} from 'process'
import {join} from 'path';

export const createWebServer = () => {
	const server = express();
	server.engine('.hbs',engine({
		extname:'.hbs',
	}))
	server.set('view engine','.hbs')
	server.set('views', join(cwd(),'views'))
	server.use(cors());
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(router);
	return server;
};
