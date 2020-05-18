import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AsFoundPage } from './as-found';
// import { CustomHeaderPageModule } from '../../../custom-header/custom-header.module';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AsFoundPage,
  ],
  imports: [
    IonicPageModule.forChild(AsFoundPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    PipesModule
  ],
})
export class AsFoundPageModule {

}
