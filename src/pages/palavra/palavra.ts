import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';

import { Dia } from '../../models/dia';

@IonicPage()
@Component({
  selector: 'page-palavra',
  templateUrl: 'palavra.html',
})
export class PalavraPage {

  public palavras = [['Shopping','Hospital'],['Cafe','Dog Park'],['Pub','Space']];
  public form: FormGroup;
  private dia: Dia;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private diaProvider: DiaProvider
  ) {
    this.form = this.formBuilder.group({
      palavra: [null, Validators.required]
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PalavraPage');
    this.diaProvider.getDocDadosDia().pipe(first()).subscribe(dados => {
      this.dia = dados;
      this.form.get('palavra').setValue(dados.palavra);
    });
  }

  public salvar(): void {
    if (this.form.valid) {
      this.dia.palavra = this.form.value.palavra;
      this.diaProvider.updateDocDadosDia(this.dia).then(() => this.navCtrl.pop());
    }
  }

}
