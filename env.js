import { config } from 'dotenv';

export const loadEnvVars = () => {
	const dot_conf = config();

	const env_vars = dot_conf.parsed;
	return env_vars;
};
