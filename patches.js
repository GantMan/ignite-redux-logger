
module.exports = {
  import: `import { createLogger } from 'redux-logger'`,
  ramda: `import R from 'Ramda'`, 
  middleware: `  /* ------------- Logger Middleware ------------- */

  // remove common noise
  const loggingBlacklist = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE']
  if (__DEV__) {
    // the logger master switch
    const USE_LOGGING = Config.reduxLogging
    // silence these saga-based messages
    // create the logger
    const logger = createLogger({
      predicate: (getState, { type }) => USE_LOGGING && R.not(R.contains(type, loggingBlacklist))
    })
    middleware.push(logger)
  }
`
}
