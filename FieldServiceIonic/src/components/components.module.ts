import { NgModule } from '@angular/core';
import { EditorSdrComponent } from './editor-sdr/editor-sdr';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';
import { DayWeekViewComponent } from './day-week-view/day-week-view';
import { ExpandableComponent } from './expandable/expandable';
import { TimeDurationComponent } from './time-duration/time-duration';
import { IonicModule } from 'ionic-angular';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { CustomTranslateLoader } from '../app/custom-translate-loader';
@NgModule({
	declarations: [EditorSdrComponent,
    DayWeekViewComponent,
    ExpandableComponent,
    TimeDurationComponent],
    imports: [ CKEditorModule, FormsModule,IonicModule,
        BsDatepickerModule,
        DatepickerModule,
        TimepickerModule.forRoot(),
        TranslateModule.forChild({
            loader: {
              provide: TranslateLoader,
              useClass: CustomTranslateLoader,
              deps: [HttpClient]
            }
          }),],
	exports: [EditorSdrComponent,
    DayWeekViewComponent,
    ExpandableComponent,
    TimeDurationComponent]
    
})
export class ComponentsModule {}
