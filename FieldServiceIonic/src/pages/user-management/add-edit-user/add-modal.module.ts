import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddModalPage } from './add-modal';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    AddModalPage,
  ],
  imports: [
    IonicPageModule.forChild(AddModalPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
})
export class AddModalPageModule {}
