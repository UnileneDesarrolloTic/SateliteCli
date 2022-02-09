import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";

import { ProductoTerminadoComponent } from '@pages/produccion/arima/producto-terminado/producto-terminado.component';
import { MateriaPrimaComponent } from '@pages/produccion/arima/materia-prima/materia-prima.component'
import { LogPedidosAutomaticosComponent } from '@pages/produccion/arima/log-pedidos-automaticos/log-pedidos-automaticos.component';

export const ProduccionRoutes: Routes = [
  {
    path: 'Arima',
    canActivate: [AuthGuard],
    children : [
      {
        path: 'ProductoTerminadoArima',
        component: ProductoTerminadoComponent,
        data: {
          title: "Productos Terminado Arima"
        }
      },
      {
        path: 'MateriaPrimaArima',
        component: MateriaPrimaComponent,
        data: {
          title: "Materia Prima Arima"
        }
      },
      {
        path: 'PedidosArima',
        component: LogPedidosAutomaticosComponent,
        data: {
          title: "Pedidos Automáticos Arima"
        }
      }
    ]
  },
]
