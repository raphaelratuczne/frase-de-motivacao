import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { RoteiroPage } from './roteiro';

@NgModule({
  declarations: [RoteiroPage],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: RoteiroPage
      }
    ])
  ],
  // exports: [RoteiroPage]
})
export class RoteiroPageModule {}
