// Ignite plugin for ReduxLogger
// ----------------------------------------------------------------------------

const NPM_MODULE_NAME = 'redux-logger'
const PLUGIN_PATH = __dirname
const APP_PATH = process.cwd()

const add = async function (context) {
  const { ignite, filesystem } = context

  // install a npm module and link it
  await ignite.addModule(NPM_MODULE_NAME)

  // Add flag to App/Config/DebugConfig.js
  context.ignite.setDebugConfig('reduxLogging', '__DEV__', true)  

  // import in CreateStore file - import createLogger from 'redux-logger'
  await ignite.patchInFile(`${APP_PATH}/App/Redux/CreateStore.js`, {
    insert: `import createLogger from 'redux-logger'`,
    after: `from 'redux'`
  })  

  // insert logger middleware right above assemble middleware 
  await ignite.patchInFile(`${APP_PATH}/App/Redux/CreateStore.js`, {
    insert: `/* ------------- Logger Middleware ------------- */

  const SAGA_LOGGING_BLACKLIST = ['EFFECT_TRIGGERED', 'EFFECT_RESOLVED', 'EFFECT_REJECTED', 'persist/REHYDRATE']
  if (__DEV__) {
    // the logger master switch
    const USE_LOGGING = Config.reduxLogging
    // silence these saga-based messages
    // create the logger
    const logger = createLogger({
      predicate: (getState, { type }) => USE_LOGGING && R.not(R.contains(type, SAGA_LOGGING_BLACKLIST))
    })
    middleware.push(logger)
  }
`,
    before: `Assemble Middleware`
  })

}

/**
 * Remove yourself from the project.
 */
const remove = async function (context) {
  const { ignite, filesystem, patching } = context

  // remove the npm module and unlink it
  await ignite.removeModule(NPM_MODULE_NAME, { unlink: true })

  // Example of removing App/ReduxLogger folder
  // const removeReduxLogger = await context.prompt.confirm(
  //   'Do you want to remove App/ReduxLogger?'
  // )
  // if (removeReduxLogger) { filesystem.remove(`${APP_PATH}/App/ReduxLogger`) }

  // Example of unpatching a file
  // patching.replaceInFile(`${APP_PATH}/App/Config/AppConfig.js`, `import '../ReduxLogger/ReduxLogger'\n`, '')
}

// Required in all Ignite plugins
module.exports = { add, remove }

