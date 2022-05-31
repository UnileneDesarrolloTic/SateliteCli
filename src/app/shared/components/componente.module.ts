import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { ModalClienteComponent } from './modal-cliente/modal-cliente.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalCargarComponent } from './modal-cargar/modal-cargar.component';


@NgModule({
  declarations: [
    PaginadorComponent,
    ModalClienteComponent,
    ModalCargarComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    PaginadorComponent
  ]
})
export class ComponenteModule { }
