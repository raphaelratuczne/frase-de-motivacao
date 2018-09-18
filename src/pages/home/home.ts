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

// import { FraseId } from '../../models/frase';
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
      console.log('caiu 111');
			return this.afAuth.auth.signInWithPopup(provider)
			.then(res => console.log('logouu', res));
		} else {
      console.log('caiu 222');
			return this.afAuth.auth.signInWithRedirect(provider)
			.then(() => {
				return this.afAuth.auth.getRedirectResult().then( result => {
					// This gives you a Google Access Token.
					// You can use it to access the Google API.
					// let token = result.credential.accessToken;
					// The signed-in user info.
					// let user = result.user;
					console.log('logouuu2', result);
				}).catch(function(error) {
					// Handle Errors here.
					alert(error.message);
				});
			});
		}
	}

  public setFraseDoDia(excluidos:number[]) {
    this.fraseProvider.getFrase(excluidos).pipe(first()).subscribe(frase => {
      this.diaProvider.setFraseDoDia(frase);
    });
  }

  public abrirModalCalendario(): void {
    let modalCalendario = this.modalCtrl.create('ModalCalendarioPage', {dados:'teste'});
    modalCalendario.onDidDismiss(data => {
      console.log(data);
     });
    modalCalendario.present();
  }
}
