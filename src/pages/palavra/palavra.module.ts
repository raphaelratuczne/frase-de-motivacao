import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PalavraPage } from './palavra';

@NgModule({
  declarations: [
    PalavraPage,
  ],
  imports: [
    IonicPageModule.forChild(PalavraPage),
  ],
})
export class PalavraPageModule {}
