import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimesheetDropdownPage } from './timesheet-dropdown';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    TimesheetDropdownPage,
  ],
  imports: [
    IonicPageModule.forChild(TimesheetDropdownPage),
    TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
    NgxPaginationModule,
    PipesModule
    
  ],
})
export class TimesheetDropdownPageModule {}
