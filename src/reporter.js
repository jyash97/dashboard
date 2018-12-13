import Raven from 'raven-js';

function configSentry() {
	return Raven.config(process.env.SENTRY_DSN, {
		release: 'v2.0.3',
		environment: process.env.NODE_ENV,
	}).install();
}
export default configSentry();
