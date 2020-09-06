/*
 In NativeScript, the app.js file is the entry point to your application.
 You can use this file to perform app-level initialization, but the primary
 purpose of the file is to pass control to the app’s first module.
 */

const application = require('@nativescript/core').Application;
const isIOS       = require('@nativescript/core/platform').isIOS;

// TODO test if this is needed in the JS version. If yes, is it replaced with correct reference?
let GMSServices;

if (isIOS) {
    GMSServices.provideAPIKey('AIzaSyAtRVvG3Be3xXiZFR7xp-K-9hy4nZ4hMFs');
}

application.run({ moduleName: 'app-root' });

/*
 Do not place any code after the application has been started as it will not
 be executed on iOS.
 */