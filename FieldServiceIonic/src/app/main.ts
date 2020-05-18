import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { enableProdMode } from "@angular/core";
import { AppModule } from './app.module';

enableProdMode();
//TODO :Handle Console.logs in prod environment
platformBrowserDynamic().bootstrapModule(AppModule);
