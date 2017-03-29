// Ignite plugin for ReduxLogger
// ----------------------------------------------------------------------------

const NPM_MODULE_NAME = 'redux-logger'
const APP_PATH = process.cwd()

const patches = require('./patches')

const add = async function (context) {
  const { ignite } = context

  // install a npm module and link it
  await ignite.addModule(NPM_MODULE_NAME)

  // Add flag to App/Config/DebugConfig.js
  context.ignite.setDebugConfig('reduxLogging', '__DEV__', true)

  // import in CreateStore file - import createLogger from 'redux-logger'
  await ignite.patchInFile(`${APP_PATH}/App/Redux/CreateStore.js`, {
    insert: patches.import,
    after: `from 'redux'`
  })
  
  // import in CreateStore file - import R from 'ramda'
  await ignite.patchInFile(`${APP_PATH}/App/Redux/CreateStore.js`, {
    insert: patches.ramda,
    after: `from 'redux'`
  })

  // insert logger middleware right above assemble middleware
  await ignite.patchInFile(`${APP_PATH}/App/Redux/CreateStore.js`, {
    insert: patches.middleware,
    before: `Assemble Middleware`
  })
}

/**
 * Remove yourself from the project.
 */
const remove = async function (context) {
  const { ignite, patching } = context

  // remove the npm module and unlink it
  await ignite.removeModule(NPM_MODULE_NAME)

  // TODO need a way to remove debug config vars
  context.ignite.setDebugConfig('reduxLogging', 'false', true)

  // unpatching a file
  await patching.replaceInFile(`${APP_PATH}/App/Redux/CreateStore.js`, patches.import, '')
  await patching.replaceInFile(`${APP_PATH}/App/Redux/CreateStore.js`, patches.middleware, '')
}

// Required in all Ignite plugins
module.exports = { add, remove }

