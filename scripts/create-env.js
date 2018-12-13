const fs = require('fs');

fs.writeFileSync(
	'./.env',
	`SENTRY_AUTH_TOKEN=${
		process.env.SENTRY_TOKEN
	}\nSENTRY_URL=https://sentry.io/\nSENTRY_ORG=test-5l\nSENTRY_PROJECT=react\n`,
);
