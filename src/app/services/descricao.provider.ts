import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';

import { Descricao } from '../models/descricao';

@Injectable({
  providedIn: 'root'
})
export class DescricaoProvider {

  private descDoc: AngularFirestoreDocument<Descricao>;

  constructor(private afs: AngularFirestore) { }

  public async getDescricoes() {
    if (!this.descDoc)
      this.descDoc = this.afs.doc<Descricao>('descricoes/descricoes');

    return this.descDoc.snapshotChanges().pipe(
      first(),
      map(desc => desc.payload.data() as Descricao)
    ).toPromise();
  }

}
