import { config } from 'dotenv';
config();

import webpush from 'web-push';

webpush.setVapidDetails(
	'mailto:ngamero@edulink.la',
	process.env.VAPID_PUBLIC_KEY,
	process.env.VAPID_PRIVATE_KEY
);

export default webpush;
