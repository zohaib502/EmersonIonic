import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddContactModalPage } from './add-contact-modal';
import { PipesModule } from '../../../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../../app/custom-translate-loader';



@NgModule({
  declarations: [
    AddContactModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddContactModalPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule
  ],
})
export class AddContactModalPageModule { }
