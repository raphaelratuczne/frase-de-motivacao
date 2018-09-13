import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, first, take } from 'rxjs/operators';
import 'rxjs/add/operator/share';

import { Frase, FraseId } from '../models/frase';

@Injectable()
export class FraseProvider {

  private frasesCollection: AngularFirestoreCollection<Frase>;
  public frases$: BehaviorSubject<FraseId[]> = new BehaviorSubject([]);
  public frase: FraseId;

  constructor(private afs: AngularFirestore) { }

  public getListaFrases(): Observable<FraseId[]> {
    if (!this.frasesCollection) {
      this.frasesCollection = this.afs.collection<Frase>('frases');

      this.frasesCollection.snapshotChanges().pipe(
        take(3),
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Frase;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      ).subscribe(frases => this.frases$.next(frases));
    }
    return this.frases$.share();
  }

  public getFrase(numerosExcluidos?:number[]): Observable<FraseId> {
    return this['subscriptor'] || (this['subscriptor'] = Observable.create(sub => {
      // carrega a ultima frase adicionada
      this.afs.collection<Frase>('frases', ref => ref.orderBy('index', 'desc').limit(1))
        .snapshotChanges()
        .pipe(first())
        .subscribe(actions => actions.map(a => {
          const frase = a.payload.doc.data() as Frase;
          let aleatorio, i = 0;
          do {
            // seleciona uma frase aleatoria
            // tenta o maximo de 100 vezes
            aleatorio = Math.floor(Math.random() * frase.index);
          } while (numerosExcluidos && numerosExcluidos.some(n => n == aleatorio) && ++i <= 100)
          // carrega a frase aleatoria selecionada
          this.afs.collection<Frase>('frases', ref => ref.where('index', '==', aleatorio))
          .snapshotChanges()
          .pipe(first())
          .subscribe(act => act.map(ac => {
            const data = ac.payload.doc.data() as Frase;
            const id = ac.payload.doc.id;
            const obj = {id, ...data};
            // console.log('frase selecionada', obj);
            this.frase = obj;
            sub.next(this.frase);
            sub.complete();
            this['subscriptor'] = null;
          }));
        }));
    }).share());

  }
}
