import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';

import { Dia } from '../../models/dia';

@IonicPage()
@Component({
  selector: 'page-texto',
  templateUrl: 'texto.html',
})
export class TextoPage {

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
      texto: [null, Validators.required]
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad TextoPage');
    this.diaProvider.getDocDadosDia().pipe(first()).subscribe(dados => {
      this.dia = dados;
      switch(this.page) {
        case 'objetivo':
          this.form.get('texto').setValue(dados.objetivo);
          break;
        case 'orgulho':
          this.form.get('texto').setValue(dados.orgulho);
          break;
      }
    });
  }

  public getHeader(): string {
    switch (this.page) {
      case 'objetivo': return 'Objetivo';
      case 'orgulho': return 'Orgulho';
    }
  }

  public getText(): string {
    switch(this.page) {
      case 'objetivo': return 'O que devo cumprir no dia de hoje:';
      case 'orgulho': return 'Sinto orgulho de mim porque:';
    }
  }

  public salvar(): void {
    if (this.form.valid) {
      switch(this.page) {
        case 'objetivo':
          this.dia.objetivo = this.form.value.texto;
          break;
        case 'orgulho':
          this.dia.orgulho = this.form.value.texto;
          break;
      }
      this.diaProvider.updateDocDadosDia(this.dia).then(() => this.navCtrl.pop());
    }
  }
}
