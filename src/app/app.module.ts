import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';


import { AppComponent } from './app.component';
// import { ClinicalEventsComponent } from './clinical-events/clinical-events.component';
// import { SimpleBarchartComponent } from './simple-barchart/simple-barchart.component';
import { ClinicaleventChartComponent } from './clinicalevent-chart/clinicalevent-chart.component';
import {TimelineService  } from "./timeline.service";
import { MaterialModule } from "./material/material.module";
// import { EventsInputComponent } from './events-input/events-input.component';
import { ItemSelectComponent } from './item-select/item-select.component';
// import { EventListComponent } from './event-list/event-list.component';
import { KeyBarComponent } from './key-bar/key-bar.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    ClinicaleventChartComponent,
    ItemSelectComponent,
    KeyBarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [TimelineService],
  bootstrap: [AppComponent]
})
export class AppModule { }
