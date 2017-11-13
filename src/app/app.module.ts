import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from "./app.component";

import { ClinicaleventChartComponent } from './clinicalevent-chart/clinicalevent-chart.component';
import { ItemSelectComponent } from './item-select/item-select.component';
import { KeyBarComponent } from './key-bar/key-bar.component';
import { MaterialModule } from "./material/material.module";
import {TimelineService  } from "./timeline.service";

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
