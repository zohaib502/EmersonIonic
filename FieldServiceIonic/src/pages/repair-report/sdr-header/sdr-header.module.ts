import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SdrHeaderPage } from './sdr-header';

@NgModule({
  declarations: [
    SdrHeaderPage,
  ],
  imports: [
    IonicPageModule.forChild(SdrHeaderPage),
  ],
  exports: [
    SdrHeaderPage
]
})
export class SdrHeaderPageModule {}
