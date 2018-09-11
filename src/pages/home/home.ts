import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

import { DiaProvider } from '../../providers/dia.provider';
import { FraseProvider } from '../../providers/frase.provider';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  public frase = '';
  private user;

  constructor(
    public navCtrl: NavController,
    public afAuth: AngularFireAuth,
    private modalCtrl: ModalController,
    private diaProvider: DiaProvider,
    private fraseProvider: FraseProvider
  ) { }

  ngOnInit() {
    this.getFrase();
  }

  comecar() {
    this.navCtrl.setRoot('RoteiroPage');
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  public getFrase() {
    this.fraseProvider.getFrase().subscribe(frase => {
      this.frase = frase.frase;
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
