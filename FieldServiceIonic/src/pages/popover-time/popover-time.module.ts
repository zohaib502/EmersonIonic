import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverTimePage } from './popover-time';
import { TimepickerModule } from 'ngx-bootstrap';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ComponentsModule } from '../../components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    PopoverTimePage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverTimePage),
    BsDatepickerModule,
    DatepickerModule,
    TimepickerModule.forRoot(),
    ComponentsModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
})
export class PopoverTimePageModule {}
