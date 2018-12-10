import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { RoteiroPage } from './roteiro';

@NgModule({
  declarations: [RoteiroPage],
  imports: [
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
