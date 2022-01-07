import { SeguimientoCandidatosProComponent } from '@pages/produccion/pronostico/seguimiento-candidatos-pro/seguimiento-candidatos-pro.component';
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
        component: SeguimientoCandidatosProComponent,
        data: {
          title: "Candidatos Producto Arima",
          urls: [
            {title: 'Candidatos Producto' }
          ]
        }
      },
      {
        path: 'candidatoMPArima',
        component: SeguimientoCandidatoMpComponent,
        data: {
          title: "Candidatos Materia Prima Arima",
          urls: [
            {title: 'Candidatos Materia Prima' }
          ]
        }
      },
      {
        path: 'pedidoCreadoArima',
        component: LogPedidosCreadosComponent,
        data: {
          title: "Pedidos Creados Arima",
          urls: [
            {title: 'Pedidos Creados' }
          ]
        }
      }
    ]
  },
]
