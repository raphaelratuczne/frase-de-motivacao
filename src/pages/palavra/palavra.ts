import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';

import { Dia } from '../../models/dia';

declare var cordova;

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
    private diaProvider: DiaProvider,
    public platform: Platform
  ) {
    this.form = this.formBuilder.group({
      palavra: [null, Validators.required],
      lembretes: [true],
      repetir: ['1']
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
      console.log(this.form.value);
      this.setAlertas(this.form.value.lembretes, this.form.value.repetir);
      this.dia.palavra = this.form.value.palavra;
      this.diaProvider.updateDocDadosDia(this.dia).then(() => this.navCtrl.pop());
    }
  }

  private setAlertas(lembretes:boolean, repetir:string): void {
    if (this.platform.is('cordova')) {
      cordova.plugins.notification.local.cancelAll(() => {
        if (lembretes) {
          let agenda = [], r = parseInt(repetir);
          for (let i = r; i <= 16; i+=r) {
            agenda.push({
              id: i,
              title: 'Amor em estampa',
              text: 'Lembrete da sua palavra: amor',
              at: new Date( new Date().getTime() + (i*2000) )
            });
          }
          cordova.plugins.notification.local.schedule(agenda);
        }
      });
    }
  }

}
