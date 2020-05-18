import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportPage } from './report';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    BsDatepickerModule,
    DatepickerModule,
    CustomHeaderPageModule,
  ],
})
export class ReportPageModule { }
