import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TextoPage } from './texto';

@NgModule({
  declarations: [
    TextoPage,
  ],
  imports: [
    IonicPageModule.forChild(TextoPage),
  ],
})
export class TextoPageModule {}
