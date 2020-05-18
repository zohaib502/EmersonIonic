import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FinalTestPage } from './final-test';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    FinalTestPage,
  ],
  imports: [
    IonicPageModule.forChild(FinalTestPage),
    SdrHeaderPageModule,
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),

  ],

})
export class FinalTestPageModule {}
