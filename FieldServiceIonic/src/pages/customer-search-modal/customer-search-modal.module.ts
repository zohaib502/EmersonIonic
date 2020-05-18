import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerSearchModalPage } from './customer-search-modal';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { PipesModule } from '../../pipes/pipes.module';
@NgModule({
  declarations: [
    CustomerSearchModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomerSearchModalPage),
    NgxPaginationModule,
    PipesModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [HttpClient]
      }
    }),
  ],
})
export class CustomerSearchModalPageModule {}
