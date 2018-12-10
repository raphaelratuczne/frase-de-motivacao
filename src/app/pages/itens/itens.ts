import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DiaProvider } from '../../services/dia.provider';

import { Dia } from '../../models/dia';

@Component({
  selector: 'page-itens',
  templateUrl: 'itens.html',
})
export class ItensPage {

  public page: string;
  public form: FormGroup;
  private dia: Dia;
  public descricao: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private diaProvider: DiaProvider,
    private alertCtrl: AlertController
  ) {
    this.route.params.pipe(first()).subscribe(params => {
      this.page = params.page;
      this.descricao = params.descr;

      if (!this.page) {
        this.router.navigateByUrl('roteiro');
      }
    });

    this.form = this.formBuilder.group({
      palavra1: [null, Validators.required],
      palavra2: [null, Validators.required],
      palavra3: [null, Validators.required]
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ItensPage', this.page);
    this.diaProvider.getDocDadosDia().pipe(first()).subscribe(dados => {
      this.dia = dados;
      switch(this.page) {
        case 'gratidao':
          this.form.get('palavra1').setValue(dados.grato1);
          this.form.get('palavra2').setValue(dados.grato2);
          this.form.get('palavra3').setValue(dados.grato3);
          break;
        case 'paixao':
          this.form.get('palavra1').setValue(dados.paixao1);
          this.form.get('palavra2').setValue(dados.paixao2);
          this.form.get('palavra3').setValue(dados.paixao3);
          break;
        case 'plano':
          this.form.get('palavra1').setValue(dados.plano1);
          this.form.get('palavra2').setValue(dados.plano2);
          this.form.get('palavra3').setValue(dados.plano3);
          break;
      }
    });
  }

  public getHeader(): string {
    switch (this.page) {
      case 'gratidao': return 'Gratidão';
      case 'paixao': return 'Paixão';
      case 'plano': return 'Planos';
    }
  }

  public getText(): string {
    switch(this.page) {
      case 'gratidao': return 'Sou grato por:';
      case 'paixao': return 'Minhas paixões são:';
      case 'plano': return 'Meus planos para o futuro são:';
    }
  }

  public salvar(): void {
    if (this.form.valid) {
      switch(this.page) {
        case 'gratidao':
          this.dia.grato1 = this.form.value.palavra1;
          this.dia.grato2 = this.form.value.palavra2;
          this.dia.grato3 = this.form.value.palavra3;
          break;
        case 'paixao':
          this.dia.paixao1 = this.form.value.palavra1;
          this.dia.paixao2 = this.form.value.palavra2;
          this.dia.paixao3 = this.form.value.palavra3;
          break;
        case 'plano':
          this.dia.plano1 = this.form.value.palavra1;
          this.dia.plano2 = this.form.value.palavra2;
          this.dia.plano3 = this.form.value.palavra3;
          break;
      }
      this.diaProvider.updateDocDadosDia(this.dia).then(() => this.router.navigateByUrl('roteiro'));
    }
  }

  public async abrirDescr() {
    const alert = await this.alertCtrl.create({
      header: this.getHeader(),
      subHeader: this.descricao,
      buttons: ['OK']
    });
    return await alert.present();
  }
}
