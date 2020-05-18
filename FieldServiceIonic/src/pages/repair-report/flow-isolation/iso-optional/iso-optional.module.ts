import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoOptionalPage } from './iso-optional';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
    IsoOptionalPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoOptionalPage),
    BsDatepickerModule,
    DatepickerModule,
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    PipesModule
  ],
})
export class IsoOptionalPageModule { }
