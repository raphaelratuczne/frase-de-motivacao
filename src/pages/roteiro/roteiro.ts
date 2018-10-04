import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { IonicPage, AlertController } from 'ionic-angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Dia } from '../../models/dia';
import { Descricao } from '../../models/descricao';

import { DiaProvider } from '../../providers/dia.provider';
import { DescricaoProvider } from '../../providers/descricao.provider';

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
  public descricao: Descricao;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private diaProvider: DiaProvider,
    private descProvider: DescricaoProvider,
    private alertCtrl: AlertController
  ) {
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

    this.descProvider.getDescricoes().then(descr => {
      this.descricao = descr;
    });
  }

  ngOnDestroy() {
    this.d$.next();
    this.d$.complete();
  }

  public goItensPage(pg:string) {
    this.navCtrl.push('ItensPage', { page: pg, descr: this.descricao[pg] });
  }

  public goTextoPage(pg:string) {
    this.navCtrl.push('TextoPage', { page: pg, descr: this.descricao[pg] });
  }

  public goPalavraPage() {
    this.navCtrl.push('PalavraPage', { descr: this.descricao.palavra });
  }

  public goHome() {
    this.navCtrl.setRoot('HomePage');
  }

  public abrirDescr() {
    this.alertCtrl.create({
      title: 'Roteiro',
      subTitle: this.descricao.roteiro,
      buttons: ['OK']
    }).present();
  }
}
