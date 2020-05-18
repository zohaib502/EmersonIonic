import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapModalPage } from './map-modal';
import { PipesModule } from '../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';



@NgModule({
  declarations: [
    MapModalPage,
  ],
  imports: [
    IonicPageModule.forChild(MapModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class MapModalPageModule { }
