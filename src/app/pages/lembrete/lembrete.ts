import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiaProvider } from '../../services/dia.provider';

import { Dia } from '../../models/dia';

@Component({
  selector: 'page-lembrete',
  templateUrl: 'lembrete.html',
  styleUrls: ['lembrete.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LembretePage {

  public dia: Dia;
  private d$: Subject<void>;

  constructor(private router: Router, private diaProvider: DiaProvider) { }

  ionViewWillEnter() {
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
    this.router.navigateByUrl('home');
  }

}
