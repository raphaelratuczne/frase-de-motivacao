import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, first } from 'rxjs/operators';
import 'rxjs/add/operator/share';

import { Frase, FraseId } from '../models/frase';

@Injectable()
export class FraseProvider {

  private frasesCollection: AngularFirestoreCollection<Frase>;
  private _frases$: Observable<FraseId[]>;
  public frases$: BehaviorSubject<FraseId[]> = new BehaviorSubject([]);
  public frase: FraseId;

  constructor(private afs: AngularFirestore) { }

  public getListaFrases(): Observable<FraseId[]> {
    if (!this._frases$) {
      this.frasesCollection = this.afs.collection<Frase>('frases');
      this._frases$ = this.frasesCollection.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Frase;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
      this._frases$.subscribe(frases => this.frases$.next(frases));
    }
    return this.frases$.share();
  }

  public getFrase(): Observable<FraseId> {
    return this['subscriptor'] || (this['subscriptor'] = Observable.create(sub => {
      this.afs.collection<Frase>('frases', ref => ref.orderBy('index', 'desc').limit(1))
        .snapshotChanges()
        .pipe(first())
        .subscribe(actions => actions.map(a => {
          const d = a.payload.doc.data() as Frase;
          const aleatorio = Math.floor(Math.random() * d.index);
          console.log('aleatorio',aleatorio);
          this.afs.collection<Frase>('frases', ref => ref.where('index', '==', aleatorio))
          .snapshotChanges()
          .pipe(first())
          .subscribe(act => act.map(ac => {
            const data = ac.payload.doc.data() as Frase;
            const id = ac.payload.doc.id;
            const obj = {id, ...data};
            console.log('frase selecionada', obj);
            this.frase = obj;
            sub.next(this.frase);
            sub.complete();
            this['subscriptor'] = null;
          }));
        }));
    }).share());

  }
}
