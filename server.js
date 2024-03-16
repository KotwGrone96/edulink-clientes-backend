import express from 'express';
import cors from 'cors';
import { router } from './routes.js';

export const createWebServer = () => {
	const server = express();
	server.use(cors());
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(router);
	return server;
};
