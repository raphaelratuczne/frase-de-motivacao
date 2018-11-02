import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';

import { Dia } from '../../models/dia';

declare var cordova;

@IonicPage()
@Component({
  selector: 'page-palavra',
  templateUrl: 'palavra.html',
})
export class PalavraPage {

  public sugestoes = [['Benfeitor','Amigo'],['Companheiro','Renovador'],['Forte','Corajoso']];
  public form: FormGroup;
  private dia: Dia;
  public descricao: string;
  private d$: Subject<void>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private diaProvider: DiaProvider,
    public platform: Platform,
    private alertCtrl: AlertController
  ) {
    this.descricao = this.navParams.get('descr');

    this.form = this.formBuilder.group({
      palavra: [null, Validators.required],
      lembretes: [true],
      repetir: ['1']
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PalavraPage');
    this.d$ = new Subject();
    this.diaProvider.getDocDadosDia().pipe(takeUntil(this.d$)).subscribe(dados => {
      if (dados) {
        this.dia = dados;
        this.form.get('palavra').setValue(dados.palavra);
        this.d$.next();
        this.d$.complete();
      }
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
              title: 'Minha Terapia',
              text: 'Lembrete da sua palavra: ' + this.dia.palavra,
              at: new Date( new Date().getTime() + (i * 1000 * 60 * 60) ),
              data: { lembrete:'lembrete' }
            });
          }
          cordova.plugins.notification.local.schedule(agenda);
        }
      });
    }
  }

  public abrirDescr() {
    this.alertCtrl.create({
      title: 'Palavra',
      subTitle: this.descricao,
      buttons: ['OK']
    }).present();
  }

}
