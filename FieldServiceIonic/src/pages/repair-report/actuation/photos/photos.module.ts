import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PhotosPage } from './photos';
import { SdrHeaderPageModule } from '../../sdr-header/sdr-header.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PipesModule } from '../../../../pipes/pipes.module';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PhotosPage,
  ],
  imports: [
    IonicPageModule.forChild(PhotosPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    SdrHeaderPageModule,
    PipesModule
  ],
})
export class PhotosPageModule { }
