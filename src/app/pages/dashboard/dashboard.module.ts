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
    SegProcesosComponent
  ],
  imports: [
    RouterModule.forChild(DashboardRoutes)
  ],
  exports: [
    PedidosComponent,
    VentasComponent,
    ExportacionComponent
  ]
})
export class DashboardModule { }
