import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmersonSignaturePage } from './emerson-signature';
import { PipesModule } from '../../../pipes/pipes.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';


@NgModule({
  declarations: [
    EmersonSignaturePage,
  ],
  imports: [
    IonicPageModule.forChild(EmersonSignaturePage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    SignaturePadModule
  ],
})
export class EmersonSignaturePageModule { }
