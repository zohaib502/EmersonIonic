import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomHeaderPage } from './custom-header';
import { PipesModule } from '../../pipes/pipes.module';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '../../app/custom-translate-loader';


@NgModule({
    declarations: [
        CustomHeaderPage
    ],
    imports: [
        IonicPageModule.forChild(CustomHeaderPage),
        TranslateModule.forChild({ loader: { provide: TranslateLoader, useClass: CustomTranslateLoader, deps: [HttpClient] } }),
        PipesModule,
    ],
    exports: [
        CustomHeaderPage
    ]
})
export class CustomHeaderPageModule { }
