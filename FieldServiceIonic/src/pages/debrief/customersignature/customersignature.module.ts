import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomersignaturePage } from './customersignature';
import { PipesModule } from '../../../pipes/pipes.module';
import { SignaturePadModule } from 'angular2-signaturepad';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';


@NgModule({
  declarations: [
    CustomersignaturePage,
  ],
  imports: [
    IonicPageModule.forChild(CustomersignaturePage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    SignaturePadModule
  ],
})
export class CustomersignaturePageModule { }
