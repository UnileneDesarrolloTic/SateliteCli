import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ProductoTerminadoComponent } from '@pages/produccion/arima/producto-terminado/producto-terminado.component';
import { MateriaPrimaComponent } from '@pages/produccion/arima/materia-prima/materia-prima.component'
import { LogPedidosAutomaticosComponent } from '@pages/produccion/arima/log-pedidos-automaticos/log-pedidos-automaticos.component';
import { CompraMateriaPrimaComponent } from "./arima/compra-materia-prima/compra-materia-prima.component";
import { EtiquetasComponent } from "./gestion/etiquetas/etiquetas.component";

export const ProduccionRoutes: Routes = [
  {
    path: 'Arima',
    canActivateChild: [AuthGuard],
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
      },
      {
        path: 'CompraMateriaPrima',
        component: CompraMateriaPrimaComponent,
        data: {
          title: "Compra Arima"
        }
      },
    ]
  },

  {
    path: 'Gestion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'ReimpresionEtiquetas',
        component: EtiquetasComponent,
        data: {
          title: "Reimpresión de Etiquetas"
        }
      },
     
    ]
  },


]
