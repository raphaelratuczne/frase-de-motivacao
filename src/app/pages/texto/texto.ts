import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { DiaProvider } from '../../services/dia.provider';

import { Dia } from '../../models/dia';

@Component({
  selector: 'page-texto',
  templateUrl: 'texto.html',
})
export class TextoPage {

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
