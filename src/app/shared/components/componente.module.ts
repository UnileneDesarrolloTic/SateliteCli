import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginadorComponent } from '@shared/components/paginador/paginador.component';
import { ModalClienteComponent } from './modal-cliente/modal-cliente.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalCargarComponent } from './modal-cargar/modal-cargar.component';
import { MensajeAdvertenciaComponent } from './mensaje-advertencia/mensaje-advertencia.component';
import { ModalMaestroItemComponent } from './modal-maestro-item/modal-maestro-item.component';
import { ModalItemCostoComponent } from './modal-item-costo/modal-item-costo.component';
import { ModalItemMastComponent } from './modal-item-mast/modal-item-mast.component';


@NgModule({
  declarations: [
    PaginadorComponent,
    ModalClienteComponent,
    ModalCargarComponent,
    MensajeAdvertenciaComponent,
    ModalMaestroItemComponent,
    ModalItemCostoComponent,
    ModalItemMastComponent,
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
