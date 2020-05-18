import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReadOriginalCommentsPageExpense } from './read-original-comments-expense';

@NgModule({
  declarations: [
    ReadOriginalCommentsPageExpense,
  ],
  imports: [
    IonicPageModule.forChild(ReadOriginalCommentsPageExpense),
  ],
})
export class ReadOriginalCommentsPageExpenseModule { }
