import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PedidosComponent } from './comercial/pedidos/pedidos.component';
import { VentasComponent } from './comercial/ventas/ventas.component';
import { ExportacionComponent } from './comercial/exportacion/exportacion.component';
import { DashboardRoutes } from '@pages/dashboard/dashboard.routing';
import { PedidoArimaComponent } from './produccion/pedido-arima/pedido-arima.component';
import { InretailComponent } from './comercial/inretail/inretail.component';
import { RentabilidadComponent } from './comercial/rentabilidad/rentabilidad.component';
import { RentabilidadEstrategicoComponent } from './comercial/rentabilidad-estrategico/rentabilidad-estrategico.component';
import { DrogueriaComponent } from './comercial/drogueria/drogueria.component';
import { SeguimientoOperacionesComponent } from './produccion/seguimiento-operaciones/seguimiento-operaciones.component';
import { SegUnishopB2cComponent } from './comercial/seg-unishop-b2c/seg-unishop-b2c.component';
import { SegOperacionesComercialComponent } from './comercial/seg-operaciones-comercial/seg-operaciones-comercial.component';
import { EstadosFinancierosComponent } from './comercial/estados-financieros/estados-financieros.component';
import { SegProcesosComponent } from './comercial/seg-procesos/seg-procesos.component';
import { DesempenioArimaComponent } from './produccion/desempenio-arima/desempenio-arima.component';
import { ObligacionesFinancierasComponent } from './comercial/obligaciones-financieras/obligaciones-financieras.component';
import { GestionCalidadComponent } from './produccion/gestion-calidad/gestion-calidad.component';
import { ExportacionBoliviaComponent } from './comercial/exportacion-bolivia/exportacion-bolivia.component';
import { BioleneComponent } from './comercial/biolene/biolene.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponenteModule } from '@shared/components/componente.module';
import { FeatherModule } from 'angular-feather';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    PedidosComponent,
    VentasComponent,
    ExportacionComponent,
    PedidoArimaComponent,
    InretailComponent,
    RentabilidadComponent,
    RentabilidadEstrategicoComponent,
    DrogueriaComponent,
    SeguimientoOperacionesComponent,
    SegUnishopB2cComponent,
    SegOperacionesComercialComponent,
    EstadosFinancierosComponent,
    SegProcesosComponent,
    DesempenioArimaComponent,
    ObligacionesFinancierasComponent,
    GestionCalidadComponent,
    ExportacionBoliviaComponent,
    BioleneComponent
  ],
  imports: [
    RouterModule.forChild(DashboardRoutes),
    CommonModule,
    ComponenteModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  exports: [
    PedidosComponent,
    VentasComponent,
    ExportacionComponent
  ]
})
export class DashboardModule { }
