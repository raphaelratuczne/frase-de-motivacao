import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/Operators';
import 'rxjs/add/observable/of';

import { DiaProvider } from '../../providers/dia.provider';
import { FraseProvider } from '../../providers/frase.provider';

import { Dia } from '../../models/dia';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {

  public dia:Dia;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private diaProvider: DiaProvider,
    private fraseProvider: FraseProvider
  ) { }

  ngOnInit() {
    const d$ = new Subject();
    this.diaProvider.getDocDadosDia().pipe(takeUntil(d$)).subscribe(async dia => {
      if (dia) {
        this.dia = dia;
        if (!dia.frase) {
          // carrega lista de frasesIndex
          const indexFrasesUsadas = await this.diaProvider.getListaIndexFrasesRegistrados();
          this.setFraseDoDia(indexFrasesUsadas);
        } else {
          d$.next();
          d$.complete();
        }
      }
    });
  }

  ngOnDestroy() {

  }

  comecar() {
    this.navCtrl.setRoot('RoteiroPage');
  }

  login() {
    // this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    this.oauthSignIn(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  private oauthSignIn(provider) {
		if (!(<any>window).cordova) {
			this.afAuth.auth.signInWithPopup(provider)
		} else {
			this.afAuth.auth.signInWithRedirect(provider);
		}
	}

  public setFraseDoDia(excluidos:number[]) {
    this.fraseProvider.getFrase(excluidos).pipe(first()).subscribe(frase => {
      this.diaProvider.setFraseDoDia(frase);
    });
  }

  public async abrirModalCalendario() {
    const dias = await this.diaProvider.getListaDiasRegistrados();
    this.modalCtrl.create('ModalCalendarioPage', {dias:dias}).present();
    // let modalCalendario = this.modalCtrl.create('ModalCalendarioPage', {dias:dias});
    // modalCalendario.onDidDismiss(data => {
    //   console.log(data);
    //  });
    // modalCalendario.present();
  }
}
