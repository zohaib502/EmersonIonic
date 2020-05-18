import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoFinalInspectionPage } from './iso-final-inspection';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    IsoFinalInspectionPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoFinalInspectionPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    PipesModule
  ],
})
export class IsoFinalInspectionPageModule { }
