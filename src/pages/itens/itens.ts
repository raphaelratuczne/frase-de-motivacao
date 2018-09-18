import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';

import { Dia } from '../../models/dia';

@IonicPage()
@Component({
  selector: 'page-itens',
  templateUrl: 'itens.html',
})
export class ItensPage {

  public page: string;
  public form: FormGroup;
  private dia: Dia;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private diaProvider: DiaProvider
  ) {
    this.page = this.navParams.get('page');
    if (!this.page) {
      this.navCtrl.setRoot('RoteiroPage');
    }

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
        case 'grato':
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
      case 'grato': return 'Gratidão';
      case 'paixao': return 'Paixão';
      case 'plano': return 'Planos';
    }
  }

  public getText(): string {
    switch(this.page) {
      case 'grato': return 'Sou grato por:';
      case 'paixao': return 'Minhas paixões são:';
      case 'plano': return 'Meus planos para o futuro são:';
    }
  }

  public salvar(): void {
    if (this.form.valid) {
      switch(this.page) {
        case 'grato':
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
      this.diaProvider.updateDocDadosDia(this.dia).then(() => this.navCtrl.pop());
    }
  }
}
