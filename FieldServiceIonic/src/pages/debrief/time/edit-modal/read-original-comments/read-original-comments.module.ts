import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadOriginalCommentsPage } from './read-original-comments';

@NgModule({
  declarations: [
    ReadOriginalCommentsPage,
  ],
  imports: [
    IonicPageModule.forChild(ReadOriginalCommentsPage),
  ],
})
export class ReadOriginalCommentsPageModule { }
