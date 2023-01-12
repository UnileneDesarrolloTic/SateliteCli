import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { GestionCalidadRoutes } from '@pages/gestion-calidad/gestion-calidad.routing';
import { SeguimientoLoteComponent } from '@pages/gestion-calidad/seguimiento-lote/seguimiento-lote.component';
import { SsomaComponent } from './ssoma/ssoma.component';
import { RegistrarEditarComponent } from './ssoma/registrar-editar/registrar-editar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VentasClientesComponent } from './ventas-clientes/ventas-clientes.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DetalleComponent } from './reclamos-quejas/detalle/detalle.component';
import { ListaComponent } from './reclamos-quejas/lista/lista.component';
import {DatePipe} from '@angular/common';
import { DetalleLoteComponent } from './reclamos-quejas/detalle-lote/detalle-lote.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
  declarations: [
    SeguimientoLoteComponent,
    VentasClientesComponent,
    SsomaComponent,
    RegistrarEditarComponent,
    DetalleComponent,
    ListaComponent,
    DetalleLoteComponent
  ],
  imports: [
    RouterModule.forChild(GestionCalidadRoutes),
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule
  ], 
  providers: [
    DatePipe
  ]
})
export class GestionCalidadModule { }
