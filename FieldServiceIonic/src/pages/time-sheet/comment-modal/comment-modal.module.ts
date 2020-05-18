import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentModalPage } from './comment-modal';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    CommentModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentModalPage),
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
})
export class CommentModalPageModule {}
