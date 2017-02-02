import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ClinicalEventsComponent } from './clinical-events/clinical-events.component';
import { SimpleBarchartComponent } from './simple-barchart/simple-barchart.component';

@NgModule({
  declarations: [
    AppComponent,
    ClinicalEventsComponent,
    SimpleBarchartComponent
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
