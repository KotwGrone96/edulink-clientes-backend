import moment from 'moment-timezone';

const timeZoneLima = () => {
	const format = moment().tz('America/Lima').format();
	return format;
};

export { timeZoneLima };
