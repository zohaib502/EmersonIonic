import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SolutionPage } from './solution';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    SolutionPage,
  ],
  imports: [
    IonicPageModule.forChild(SolutionPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    PipesModule
  ],
})
export class SolutionPageModule {}
