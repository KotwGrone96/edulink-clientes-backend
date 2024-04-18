import express from 'express';
import cors from 'cors';
import { router } from './router.js';

export const createWebServer = () => {
	const server = express();
	server.use(cors());
	server.use(express.json());
	server.use(express.urlencoded({ extended: true }));
	server.use(router);
	return server;
};
