import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  private frasesCollection: AngularFirestoreCollection<any>;
  frases: Observable<any[]>;

  constructor(public navCtrl: NavController, public afAuth: AngularFireAuth, private afs: AngularFirestore) {

  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('user', user);
        this.frasesCollection = this.afs.collection<any>('frases');
        this.frases = this.frasesCollection.valueChanges();

        this.frases.subscribe(f => console.log('frases', f));
      }
    });
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
}
