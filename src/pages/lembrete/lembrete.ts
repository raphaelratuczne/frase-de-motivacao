import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';

import { Dia } from '../../models/dia';

@IonicPage()
@Component({
  selector: 'page-lembrete',
  templateUrl: 'lembrete.html',
})
export class LembretePage {

  public dia: Dia;
  private d$: Subject<void>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private diaProvider: DiaProvider) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad LembretePage');
    this.d$ = new Subject();
    this.diaProvider.getDocDadosDia().pipe(takeUntil(this.d$)).subscribe(dados => {
      if (dados) {
        this.dia = dados;
        this.d$.next();
        this.d$.complete();
      }
    });
  }

  public goHome() {
    this.navCtrl.setRoot('HomePage');
  }

}
