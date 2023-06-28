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
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { OutdoorTempComponent } from './outdoor-temp/outdoor-temp.component';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientJsonpModule } from '@angular/common/http';
import { ZoneTempsComponent } from './zone-temps/zone-temps.component';
import { SvgRescaleComponent } from './svg-rescale/svg-rescale.component';
import { ChartToolBarComponent } from './sgv/chart-tool-bar/chart-tool-bar.component';
import { SwitchComponent } from './components/switch/switch.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatMenuModule} from '@angular/material/menu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { SchedulerComponent } from './forms/scheduler/scheduler.component';
import {MatSelectModule} from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { NotifierComponent } from './forms/notifier/notifier.component';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { ListlogComponent } from './components/listlog/listlog.component';

@NgModule({
  declarations: [
    AppComponent,
    OutdoorTempComponent,
    ZoneTempsComponent,
    SvgRescaleComponent,
    ChartToolBarComponent,
    SwitchComponent,
    NavbarComponent,
    DashboardComponent,
    HomeComponent,
    SchedulerComponent,
    ScheduleListComponent,
    NotificationListComponent,
    NotifierComponent,
    ListlogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
