import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IsoPhotosPage } from './iso-photos';

@NgModule({
  declarations: [
    IsoPhotosPage,
  ],
  imports: [
    IonicPageModule.forChild(IsoPhotosPage),
  ],
})
export class IsoPhotosPageModule {}
