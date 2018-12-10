import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { LembretePage } from './lembrete';

@NgModule({
  declarations: [
    LembretePage,
  ],
  imports: [
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LembretePage
      }
    ])
  ],
})
export class LembretePageModule {}
