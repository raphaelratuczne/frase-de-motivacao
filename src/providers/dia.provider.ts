import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map, first, takeUntil } from 'rxjs/operators';
import 'rxjs/add/operator/share';

import { Dia, DiaIndexFrase } from '../models/dia';
import { Usuario } from '../models/usuario';
import { FraseId } from '../models/frase';

@Injectable()
export class DiaProvider {

  private usuarioDoc: AngularFirestoreDocument<Usuario>;
  private dadosDoc: AngularFirestoreDocument<Dia>;
  public dados$: BehaviorSubject<Dia> = new BehaviorSubject(undefined);
  private hoje: string;

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    const data = new Date();
    this.hoje = data.getFullYear() + '-' + ('0' + (data.getMonth() + 1)).substr(-2) + '-' + ('0' + data.getDate()).substr(-2);

    this.carregamentoInicial();
  }

  private carregamentoInicial(): Observable<void> {
    return this['subscriptor'] || (this['subscriptor'] = Observable.create(sub => {
      this.afAuth.authState.pipe(takeUntil(this['subscriptor'])).subscribe(user => {
        if (user) {
          this.usuarioDoc = this.afs.doc<Usuario>('usuarios/'+user.uid);
          sub.next();
          sub.complete();
          this['subscriptor'] = undefined;
        }
      });
    }).share());
  }

  public getDocDadosDia(dia:string = this.hoje): Observable<Dia> {
    if (!this.dadosDoc) this.carregarDadosDia(dia);

    return this.dados$.share();
  }

  public async updateDocDadosDia(dia:Dia) {
    if (!this.dadosDoc) await this.carregarDadosDia(this.hoje);

    return this.dadosDoc.update(dia);
  }

  public async carregarDadosDia(dia:string) {
    if (!this.usuarioDoc) {
      await this.carregamentoInicial().toPromise();
    }
    this.dadosDoc = this.usuarioDoc.collection('dados').doc(dia);

    this.dadosDoc.valueChanges().subscribe(dadosDia => this.dados$.next(dadosDia));

    this.dadosDoc.valueChanges().pipe(first()).subscribe(async existeDia => {
      if (!existeDia) {
        // cria dados do dia
        const hoje = new Dia(new Date());
        this.dadosDoc.set(hoje.toJson());

        // registra dia na lista
        this.updateDocDias(dia);
      }
    });
  }

  public async setFraseDoDia(frase:FraseId) {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();
    if (!this.dadosDoc) await this.carregarDadosDia(this.hoje);

    this.dadosDoc.update({frase:frase.frase});
    this.updateDocDias(this.hoje, frase.index);
  }

  public async getDocDias(): Promise<DiaIndexFrase> {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    return this.usuarioDoc.valueChanges().pipe(
      first(),
      map(objDias => {
        return objDias['dias'] || {};
      })
    ).toPromise();
  }

  public async updateDocDias(dia:string, indexFrase: number = null) {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    const objDias = await this.usuarioDoc.valueChanges().pipe(first()).toPromise();
    if (typeof objDias['dias'] == 'undefined') objDias['dias'] = {};
    objDias['dias'][dia] = indexFrase;
    this.usuarioDoc.update(objDias);
  }

  public async getListaDiasRegistrados(): Promise<string[]> {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    const objDias = await this.getDocDias();
    return Object.keys(objDias);
  }

  public async getListaIndexFrasesRegistrados(): Promise<number[]> {
    if (!this.usuarioDoc) await this.carregamentoInicial().toPromise();

    const objDias = await this.getDocDias();
    return Object.keys(objDias).map(dia => objDias[dia]);
  }

}
