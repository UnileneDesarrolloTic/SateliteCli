import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { ModalPdfComponent } from './modal-pdf/modal-pdf.component';
import { ModalVerTransitoComponent } from './modal-ver-transito/modal-ver-transito.component';
import { ModalEmpleadorComponent } from './modal-empleador/modal-empleador.component';
import { HistorialFechaprometidaOcComponent } from './historial-fechaprometida-oc/historial-fechaprometida-oc.component';
import { ModalComentarioArimaComponent } from './modal-comentario-arima/modal-comentario-arima.component';


@NgModule({
  declarations: [
    PaginadorComponent,
    ModalClienteComponent,
    ModalCargarComponent,
    MensajeAdvertenciaComponent,
    ModalMaestroItemComponent,
    ModalItemCostoComponent,
    ModalItemMastComponent,
    ModalPdfComponent,
    ModalVerTransitoComponent,
    ModalEmpleadorComponent,
    HistorialFechaprometidaOcComponent,
    ModalComentarioArimaComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  exports:[
    PaginadorComponent,
  ]
})
export class ComponenteModule { }
