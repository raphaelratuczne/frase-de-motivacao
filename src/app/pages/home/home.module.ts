import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
// import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { HomePage } from './home.page';
import { ModalCalendarioPageModule } from './modal-calendario/modal-calendario.module';
import { ModalDiaPageModule } from './modal-dia/modal-dia.module';
import { MenuPageModule } from './menu/menu.module';

@NgModule({
  imports: [
    CommonModule,
    // FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    // SocialSharing,
    ModalCalendarioPageModule,
    ModalDiaPageModule,
    MenuPageModule
  ],
  declarations: [HomePage],
  providers: [SocialSharing]
})
export class HomePageModule {}
