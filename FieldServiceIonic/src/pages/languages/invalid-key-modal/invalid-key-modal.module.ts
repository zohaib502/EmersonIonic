import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipesModule } from '../../../pipes/pipes.module';
import { InvalidKeyModalPage } from './invalid-key-modal';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';

@NgModule({
  declarations: [
    InvalidKeyModalPage,
  ],
  imports: [
    IonicPageModule.forChild(InvalidKeyModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
  ],
})
export class InvalidKeyModalPageModule { }
