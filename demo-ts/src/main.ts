/*
In NativeScript, the app.ts file is the entry point to your application.
You can use this file to perform app-level initialization, but the primary
purpose of the file is to pass control to the app’s first module.
*/

import { Application, isIOS } from '@nativescript/core';

declare let GMSServices: any;

if (isIOS) {
    GMSServices.provideAPIKey('AIzaSyAtRVvG3Be3xXiZFR7xp-K-9hy4nZ4hMFs');
}


Application.run({ moduleName: 'app-root' });

/*
Do not place any code after the application has been started as it will not
be executed on iOS.
*/
