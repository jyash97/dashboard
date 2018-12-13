import Raven from 'raven-js';

function configSentry() {
	return Raven.config('https://d9212771dfca4f948a196c664e10c25e@sentry.io/1352707', {
		release: 'v2.0.7',
		environment: process.env.NODE_ENV,
	}).install();
}
export default configSentry();
