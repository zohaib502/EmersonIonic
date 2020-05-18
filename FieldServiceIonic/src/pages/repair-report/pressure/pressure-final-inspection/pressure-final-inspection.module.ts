import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PressureFinalInspectionPage } from './pressure-final-inspection';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { PipesModule } from '../../../../pipes/pipes.module';

@NgModule({
  declarations: [
    PressureFinalInspectionPage,
  ],
  imports: [
    IonicPageModule.forChild(PressureFinalInspectionPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader } }),
    SdrHeaderPageModule,
    PipesModule
  ],
})
export class PressureFinalInspectionPageModule { }
