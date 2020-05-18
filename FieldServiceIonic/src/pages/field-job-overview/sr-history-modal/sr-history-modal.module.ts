import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SrHistoryModalPage } from './sr-history-modal';
import { PipesModule } from '../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';

@NgModule({
  declarations: [
    SrHistoryModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SrHistoryModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class SrHistoryModalPageModule { }
