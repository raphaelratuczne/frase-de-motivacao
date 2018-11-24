import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Deeplinks } from '@ionic-native/deeplinks';

declare var cordova;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private screenOrientation: ScreenOrientation,
    private deeplinks: Deeplinks
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      { title: 'Roteiro', component: 'RoteiroPage' }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.statusBar.styleDefault();
        setTimeout(() => {this.splashScreen.hide();}, 5000);

        this.deeplinks.route({
           '/lembrete': 'LembretePage'
        }).subscribe(match => {
           // match.$route - the route we matched, which is the matched entry from the arguments to route()
           // match.$args - the args passed in the link
           // match.$link - the full link data
           // console.log('Successfully matched route', match);
           this.nav.setRoot('LembretePage');
        }, nomatch => {
           // nomatch.$link - the full link data
           // console.error('Got a deeplink that didn\'t match', nomatch);
        });

        // console.log('notification', cordova.plugins.notification.local);
        cordova.plugins.notification.local.on('click', (notification) => {
          // console.log('abriu motificação', notification);
          this.nav.setRoot('LembretePage');
        });

      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
