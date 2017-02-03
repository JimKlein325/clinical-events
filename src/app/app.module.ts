import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ClinicalEventsComponent } from './clinical-events/clinical-events.component';
import { SimpleBarchartComponent } from './simple-barchart/simple-barchart.component';
import { TextTestComponent } from './text-test/text-test.component';

@NgModule({
  declarations: [
    AppComponent,
    ClinicalEventsComponent,
    SimpleBarchartComponent,
    TextTestComponent
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
