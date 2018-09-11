import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { HomePage } from './home';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    AngularFireAuthModule
  ],
  exports: [
    HomePage
  ]
})
export class HomePageModule {}
