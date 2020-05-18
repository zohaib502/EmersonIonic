import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExpensePage } from './expense';
import { PipesModule } from '../../../pipes/pipes.module';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../../app/custom-translate-loader';


@NgModule({
  declarations: [
    ExpensePage,
  ],
  imports: [
    IonicPageModule.forChild(ExpensePage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    PipesModule,
    BsDatepickerModule,
    DatepickerModule
  ],
})
export class ExpensePageModule { }
