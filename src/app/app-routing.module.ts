import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule' },
  { path: 'lembrete', loadChildren: './pages/lembrete/lembrete.module#LembretePageModule' },
  { path: 'roteiro', loadChildren: './pages/roteiro/roteiro.module#RoteiroPageModule' },
  { path: 'itens/:page/:descr', loadChildren: './pages/itens/itens.module#ItensPageModule' },
  { path: 'texto/:page/:descr', loadChildren: './pages/texto/texto.module#TextoPageModule' },
  { path: 'palavra/:descr/:alerta', loadChildren: './pages/palavra/palavra.module#PalavraPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
