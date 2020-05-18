import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Tabs } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { DatabaseProvider } from '../providers/database/database';
import { LocalServiceProvider } from '../providers/local-service/local-service';
import { LoggerProvider } from '../providers/logger/logger';
import { SyncProvider } from '../providers/sync/sync';
import { TransformProvider } from '../providers/transform/transform';
import { UtilityProvider } from '../providers/utility/utility';
import { ValueProvider } from '../providers/value/value';
import { CloudService } from '../providers/cloud-service/cloud-service';

import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { Http } from '@angular/http';
// import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from '@angular/http';
import { SignaturePadModule } from 'angular2-signaturepad';
import { Ionic2RatingModule } from 'ionic2-rating';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';

import { SQLite } from '@ionic-native/sqlite';
import { AppVersion } from '@ionic-native/app-version';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { FileChooser } from '@ionic-native/file-chooser';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Network } from '@ionic-native/network';
import { FileOpener } from '@ionic-native/file-opener';
import { Device } from '@ionic-native/device';
import { SqliteDbCopy } from '@ionic-native/sqlite-db-copy';
import { CreateFsrProvider } from '../providers/create-fsr/create-fsr';


import { Clipboard } from '@ionic-native/clipboard';

import { SortPipe } from '../pipes/sort/sort';
import { SearchPipe } from '../pipes/search/search';
import { ListFilterPipe } from '../pipes/list-filter/list-filter';
import { ShowActiveTimeZonePipe } from '../pipes/showActiveTimeZonePipe/showActiveTimeZonePipe';
import { FilterUniquePipe } from '../pipes/filter-unique/filter-unique';

import { IonicStorageModule } from '@ionic/storage';

import { CustomTranslateLoader } from '../app/custom-translate-loader';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { ImageResizer } from '@ionic-native/image-resizer';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { CreateSdrProvider } from '../providers/create-sdr/create-sdr';
import { CustomerDbProvider } from '../providers/customer-db/customer-db';
import { AttachmentProvider } from '../providers/attachment/attachment';
import { LocalServiceSdrProvider } from '../providers/local-service-sdr/local-service-sdr';
import { SdrPdfReportProvider } from '../providers/sdr-pdf-report/sdr-pdf-report';

import {FileUpdaterProvider} from "../providers/file-updater/file-updater";
import {FileTransfer} from "@ionic-native/file-transfer";
import { SdrUtilityProvider } from '../providers/sdr-utility/sdr-utility';
import { FetchProvider } from '../providers/sync/fetch/fetch';
import { SubmitProvider } from '../providers/sync/submit/submit';

// declare var cordova;

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    SignaturePadModule,
    Ionic2RatingModule,
    BsDatepickerModule.forRoot(),
    DatepickerModule.forRoot(),
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      // pageTransitionDelay: 0,
      // animate: false
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    IonicStorageModule.forRoot(),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    SQLite,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BackgroundMode,
    DatabaseProvider,
    LocalServiceProvider,
    SignaturePadModule,
    CloudService,
    AppVersion,
    InAppBrowser,
    UtilityProvider,
    Network,
    ValueProvider,
    SyncProvider,
    TransformProvider,
    FileOpener,
    FileChooser,
    Clipboard,
    // Base64, 26-7-18, Suraj Gorai, Remove Base64 plugin
    File,
    FileTransfer,
    Tabs,
    Device,
    CreateFsrProvider,
    LoggerProvider,
    EmailComposer,
    SortPipe,
    SearchPipe,
    ListFilterPipe,
    ShowActiveTimeZonePipe,
    ScreenOrientation,
    ImageResizer,
    FilterUniquePipe,
    CreateSdrProvider,
    CustomerDbProvider,
    SqliteDbCopy,
    AttachmentProvider,
    LocalServiceSdrProvider,
    SdrPdfReportProvider,
    FileUpdaterProvider,
    SdrUtilityProvider,
    FetchProvider,
    SubmitProvider
  ]
})
export class AppModule { }
