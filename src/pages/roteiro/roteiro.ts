import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Dia } from '../../models/dia';

import { DiaProvider } from '../../providers/dia.provider';

@IonicPage()
@Component({
  selector: 'page-roteiro',
  templateUrl: 'roteiro.html'
})
export class RoteiroPage implements OnDestroy {

  public desPaixao: boolean = true;
  public desPlano: boolean = true;
  public desObjetivo: boolean = true;
  public desOrgulho: boolean = true;
  public desPalavra: boolean = true;
  private d$: Subject<void>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private diaProvider: DiaProvider) {
    this.d$ = new Subject();
    this.diaProvider.getDocDadosDia().pipe(takeUntil(this.d$)).subscribe((dia:Dia) => {
      // console.log('carregou dia', dia);
      if (dia) {
        const isEmpty = val => val.trim() == '';
        this.desPaixao = (isEmpty(dia.grato1) || isEmpty(dia.grato2) || isEmpty(dia.grato3));
        this.desPlano = (isEmpty(dia.paixao1) || isEmpty(dia.paixao2) || isEmpty(dia.paixao3) || this.desPaixao);
        this.desObjetivo = (isEmpty(dia.plano1) || isEmpty(dia.plano2) || isEmpty(dia.plano3) || this.desPlano);
        this.desOrgulho = (isEmpty(dia.objetivo) || this.desObjetivo);
        this.desPalavra = isEmpty(dia.orgulho) || this.desOrgulho;
      }
    });
  }

  ngOnDestroy() {
    this.d$.next();
    this.d$.complete();
  }

  public goItensPage(pg:string) {
    this.navCtrl.push('ItensPage', { page: pg });
  }

  public goTextoPage(pg:string) {
    this.navCtrl.push('TextoPage', { page: pg });
  }

  public goPalavraPage() {
    this.navCtrl.push('PalavraPage');
  }
}
