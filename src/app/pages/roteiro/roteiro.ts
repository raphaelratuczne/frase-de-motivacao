import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Dia } from '../../models/dia';
import { Descricao } from '../../models/descricao';

import { DiaProvider } from '../../services/dia.provider';
import { DescricaoProvider } from '../../services/descricao.provider';

@Component({
  selector: 'page-roteiro',
  templateUrl: 'roteiro.html',
  styleUrls: ['roteiro.scss'],
  encapsulation: ViewEncapsulation.None
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
    private router: Router,
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
    this.router.navigateByUrl(`itens/${pg}/${btoa(this.descricao[pg])}`);
  }

  public goTextoPage(pg:string) {
    this.router.navigateByUrl(`texto/${pg}/${btoa(this.descricao[pg])}`);
  }

  public goPalavraPage() {
    this.router.navigateByUrl('palavra');
  }

  public goHome() {
    this.router.navigateByUrl('home');
  }

  public async abrirDescr() {
    const alert = await this.alertCtrl.create({
      header: 'Roteiro',
      subHeader: this.descricao.roteiro,
      buttons: ['OK']
    });
    return await alert.present();
  }
}
