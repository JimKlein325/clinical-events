import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MdTabsModule, MdInputModule, MdButtonModule, MdCheckboxModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdListModule,  MdRadioModule, MdSelectModule, MdChipsModule} from '@angular/material';


@NgModule({
  imports: [MdTabsModule, MdInputModule,MdButtonModule, MdCheckboxModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdListModule,  MdRadioModule, MdSelectModule, MdChipsModule],

  exports: [MdTabsModule, MdInputModule,MdButtonModule, MdCheckboxModule,  MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdListModule,  MdRadioModule, MdSelectModule, MdChipsModule],
})
export class MaterialModule { }


