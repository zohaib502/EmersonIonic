import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressPage } from './address';
import { PipesModule } from '../../pipes/pipes.module';
import { CustomHeaderPageModule } from '../custom-header/custom-header.module';
import {  HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';


@NgModule({
  declarations: [
    AddressPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
    PipesModule,
    CustomHeaderPageModule
  ],
})
export class AddressPageModule { }
