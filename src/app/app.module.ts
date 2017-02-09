import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { Observable } from 'rxjs/Observable';


import { AppComponent } from './app.component';
import { ClinicalEventsComponent } from './clinical-events/clinical-events.component';
import { SimpleBarchartComponent } from './simple-barchart/simple-barchart.component';
import { TextTestComponent } from './text-test/text-test.component';
import { ClinicaleventChartComponent } from './clinicalevent-chart/clinicalevent-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    ClinicalEventsComponent,
    SimpleBarchartComponent,
    TextTestComponent,
    ClinicaleventChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
