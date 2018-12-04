import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';
import { PalavraProvider } from '../../providers/palavra.provider';
import { LocalNotificationProvider } from '../../providers/local-notification.provider';

import { Dia } from '../../models/dia';
import { Palavra } from '../../models/palavra';

@IonicPage()
@Component({
  selector: 'page-palavra',
  templateUrl: 'palavra.html',
})
export class PalavraPage {

  public sugestoes = []; // [['Benfeitor','Amigo'],['Companheiro','Renovador'],['Forte','Corajoso']];
  public form: FormGroup;
  private dia: Dia;
  public descricao: string;
  public alerta: string;
  private d$: Subject<void>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private formBuilder: FormBuilder,
    private diaProvider: DiaProvider,
    private palavraProvider: PalavraProvider,
    public platform: Platform,
    private alertCtrl: AlertController,
    public localNotificationProvider: LocalNotificationProvider
  ) {
    this.descricao = this.navParams.get('descr');
    this.alerta = this.navParams.get('alerta');

    this.form = this.formBuilder.group({
      palavra: [null, Validators.required],
      lembretes: [true],
      repetir: ['1']
    });

    this.palavraProvider.getPalavras().subscribe((p:Palavra[]) => {
      p = p.sort(() => 0.5 - Math.random());
      this.sugestoes = [
        [p[0].palavra, p[1].palavra],
        [p[2].palavra, p[3].palavra],
        [p[4].palavra, p[5].palavra]
      ];
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
      // console.log(this.form.value);
      this.localNotificationProvider.setAlertasPalavra(this.form.value.palavra, this.form.value.lembretes, this.form.value.repetir);
      if (!this.dia.palavra) {
        this.dia.palavra = this.form.value.palavra;
        this.diaProvider.updateDocDadosDia(this.dia).then(() => this.alertaRoteiro());
      }
      else {
        this.dia.palavra = this.form.value.palavra;
        this.diaProvider.updateDocDadosDia(this.dia).then(() => this.navCtrl.pop());
      }
    }
  }

  public abrirDescr() {
    this.alertCtrl.create({
      title: 'Palavra',
      subTitle: this.descricao,
      buttons: ['OK']
    }).present();
  }

  public abrirAlerta() {
    this.alertCtrl.create({
      title: 'Alertas',
      subTitle: this.alerta,
      buttons: ['OK']
    }).present();
  }

  private alertaRoteiro() {
    this.alertCtrl.create({
      title: 'Parabéns',
      subTitle: 'Seu diário foi finalizado com sucesso.<br><br>Acompanhe nosso instagram:<br><br>@amoremestampa',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    }).present();
  }

}
