import { ProductosArimaComponent } from './arima/productos-arima/productos-arima.component';
import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { LogPedidosCreadosComponent } from '@pages/produccion/pronostico/log-pedidos-creados/log-pedidos-creados.component';
import { SeguimientoCandidatoMpComponent } from '@pages/produccion/pronostico/seguimiento-candidato-mp/seguimiento-candidato-mp.component'
import { CompraMPrimaComponent } from '@pages/produccion/pronostico/compra-mprima/compra-mprima.component'



export const ProduccionRoutes: Routes = [
  {
    path: 'Arima',
    canActivate: [AuthGuard],
    children : [
      {
        path: 'ProductoTerminadoArima',
        component: ProductosArimaComponent ,
        data: {
        title: "Productos Arima",
        urls: [
                { title: 'Productos Arima' }
            ]
        }
      },
      {
        path: 'MateriaPrimaArima',
        component: SeguimientoCandidatoMpComponent ,
        data: {
        title: "Materia Pri. Arima",
        urls: [
                { title: 'Candidatos Materia Prima Arima' }
            ]
        }
      },
      {
        path: 'PedidosArima',
        component: CompraMPrimaComponent ,
        data: {
        title: "Pedidos Arima",
        urls: [
                { title: 'Pedidos Arima' }
            ]
        }
      },
      {
        path: 'ComprasMpArima',
        component: CompraMPrimaComponent ,
        data: {
        title: "Compras M.Prima",
        urls: [
                { title: 'Compras M.Prima' }
            ]
        }
      },
	  
    ]
  },
]
