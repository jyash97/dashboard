import Raven from 'raven-js';

function configSentry() {
	return Raven.config(process.env.SENTRY_TOKEN, {
		release: 'v2.0.1',
		environment: process.env.NODE_ENV,
	}).install();
}
export default configSentry();
