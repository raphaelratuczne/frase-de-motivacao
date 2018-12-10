import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';

import { DiaProvider } from '../../services/dia.provider';
import { PalavraProvider } from '../../services/palavra.provider';
import { LocalNotificationProvider } from '../../services/local-notification.provider';

import { Dia } from '../../models/dia';
import { Palavra } from '../../models/palavra';

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
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private diaProvider: DiaProvider,
    private palavraProvider: PalavraProvider,
    public platform: Platform,
    private alertCtrl: AlertController,
    public localNotificationProvider: LocalNotificationProvider
  ) {
    this.route.params.pipe(first()).subscribe(params => {
      this.descricao = params.descr;
      this.alerta = params.alerta;
    });

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
        this.diaProvider.updateDocDadosDia(this.dia).then(() => this.router.navigateByUrl('roteiro'));
      }
    }
  }

  public async abrirDescr() {
    const alert = await this.alertCtrl.create({
      header: 'Palavra',
      subHeader: this.descricao,
      buttons: ['OK']
    });
    return await alert.present();
  }

  public async abrirAlerta() {
    const alert = await this.alertCtrl.create({
      header: 'Alertas',
      subHeader: this.alerta,
      buttons: ['OK']
    });
    return await alert.present();
  }

  private async alertaRoteiro() {
    const alert = await this.alertCtrl.create({
      header: 'Parabéns',
      subHeader: 'Seu diário foi finalizado com sucesso.<br><br>Acompanhe nosso instagram:<br><br>@amoremestampa',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.router.navigateByUrl('roteiro');
        }
      }]
    });
    return await alert.present();
  }

}
