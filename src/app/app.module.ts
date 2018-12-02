import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SocialSharing } from '@ionic-native/social-sharing';

import { configFireBase } from '../const';

import { MyApp } from './app.component';

import { DiaProvider } from '../providers/dia.provider';
import { FraseProvider } from '../providers/frase.provider';
import { DescricaoProvider } from '../providers/descricao.provider';
import { PalavraProvider } from '../providers/palavra.provider';
import { LocalNotificationProvider } from '../providers/local-notification.provider';

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(configFireBase),
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    Deeplinks,
    SocialSharing,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DiaProvider,
    FraseProvider,
    DescricaoProvider,
    PalavraProvider,
    LocalNotificationProvider
  ]
})
export class AppModule {}
