import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DiaProvider } from '../../providers/dia.provider';
import { PalavraProvider } from '../../providers/palavra.provider';

import { Dia } from '../../models/dia';
import { Palavra } from '../../models/palavra';

declare var cordova;

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
    private alertCtrl: AlertController
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
      console.log(this.form.value);
      this.setAlertas(this.form.value.lembretes, this.form.value.repetir);
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

  private setAlertas(lembretes:boolean, repetir:string): void {
    if (this.platform.is('cordova')) {
      cordova.plugins.notification.local.cancelAll(() => {
        if (lembretes) {
          let agenda = [], r = parseInt(repetir);
          // loop para setar todos os lembretes
          for (let i = r; i <= 16; i+=r) {
            agenda.push({
              id: i,
              title: 'Minha Terapia',
              text: 'Lembrete da sua palavra: ' + this.dia.palavra,
              at: new Date( new Date().getTime() + (i * 1000 * 60 * 60) ),
              data: { lembrete:'lembrete' }
            });
          }
          // seta lembretes para os proximos 3 dias
          let hj = new Date();
          hj.setHours(6);
          hj.setMinutes(0);
          hj.setSeconds(0);
          for (let i = 101; i <= 107; i++) {
            agenda.push({
              id: i,
              title: 'Minha Terapia',
              text: 'Bom dia, não esqueça de fazer sua terapia hoje.',
              at: new Date( hj.getTime() + ((i-100) * 1000 * 60 * 60 * 23) )
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
      subTitle: 'Seu diário foi finalizado com sucesso.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.pop();
        }
      }]
    }).present();
  }

}
