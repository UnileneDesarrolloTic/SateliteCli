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

@NgModule({
  declarations: [
    PedidosComponent,
    VentasComponent,
    ExportacionComponent,
    PedidoArimaComponent,
    InretailComponent,
    RentabilidadComponent,
    RentabilidadEstrategicoComponent
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
