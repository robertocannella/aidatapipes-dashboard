import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { AngularFireAnalyticsModule } from '@angular/fire/compat/analytics';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { OutdoorTempComponent } from './outdoor-temp/outdoor-temp.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';
import { ZoneTempsComponent } from './zone-temps/zone-temps.component';
import { SvgRescaleComponent } from './svg-rescale/svg-rescale.component';
import { ChartToolBarComponent } from './sgv/chart-tool-bar/chart-tool-bar.component';
import { SwitchComponent } from './components/switch/switch.component';
@NgModule({
  declarations: [
    AppComponent,
    OutdoorTempComponent,
    ZoneTempsComponent,
    SvgRescaleComponent,
    ChartToolBarComponent,
    SwitchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    HttpClientModule,
    HttpClientJsonpModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
