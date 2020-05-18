import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverEditDeletePage } from './popover-edit-delete';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PopoverEditDeletePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverEditDeletePage),
    TranslateModule.forChild({
        loader: {
          provide: TranslateLoader,
          useClass: CustomTranslateLoader,
          deps: [HttpClient]
        }
      }),
  ],
})
export class PopoverEditDeletePageModule {}
