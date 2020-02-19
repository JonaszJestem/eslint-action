const { exitWithError, run } = require('./lib/run');

run().catch(exitWithError);
