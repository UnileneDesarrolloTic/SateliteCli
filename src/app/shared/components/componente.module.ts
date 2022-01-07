import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginadorComponent } from '@shared/components/paginador/paginador.component';


@NgModule({
  declarations: [
    PaginadorComponent,
  ],
  imports: [
    CommonModule
  ],
  exports:[
    PaginadorComponent
  ]
})
export class ComponenteModule { }
