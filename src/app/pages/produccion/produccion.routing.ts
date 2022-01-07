import { ProductosArimaComponent } from './arima/productos-arima/productos-arima.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { LogPedidosCreadosComponent } from '@pages/produccion/pronostico/log-pedidos-creados/log-pedidos-creados.component';
import { SeguimientoCandidatoMpComponent } from '@pages/produccion/pronostico/seguimiento-candidato-mp/seguimiento-candidato-mp.component'

export const ProduccionRoutes: Routes = [
  {
    path: 'pronostico',
    canActivate: [AuthGuard],
    children : [
      {
        path: 'candidatoProArima',
        component: ProductosArimaComponent,
        data: {
          title: "Productos arima"
        }
      },
      {
        path: 'candidatoMPArima',
        component: SeguimientoCandidatoMpComponent,
        data: {
          title: "Candidatos Materia Prima Arima"
        }
      },
      {
        path: 'pedidoCreadoArima',
        component: LogPedidosCreadosComponent,
        data: {
          title: "Pedidos Creados Arima"
        }
      }
    ]
  },
]
