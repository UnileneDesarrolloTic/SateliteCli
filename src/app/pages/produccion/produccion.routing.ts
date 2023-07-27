import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ProductoTerminadoComponent } from '@pages/produccion/arima/producto-terminado/producto-terminado.component';
import { MateriaPrimaComponent } from '@pages/produccion/arima/materia-prima/materia-prima.component'
import { LogPedidosAutomaticosComponent } from '@pages/produccion/arima/log-pedidos-automaticos/log-pedidos-automaticos.component';
import { CompraMateriaPrimaComponent } from "./arima/compra-materia-prima/compra-materia-prima.component";
import { EtiquetasComponent } from "./gestion/etiquetas/etiquetas.component";
import { SeguimientoOrdenCompraComponent } from "./gestion/seguimiento-orden-compra/seguimiento-orden-compra.component";
import { OcDrogueriaComponent } from "./arima/oc-drogueria/oc-drogueria.component";
import { CompraAgujaComponent } from "./arima/compra-aguja/compra-aguja.component";
import { CompraNacionalImportacionComponent } from "./arima/compra-nacional-importacion/compra-nacional-importacion.component";
import { ProgramacionComponent } from "./gestion/programacion/programacion.component";
import { GestionEquiposComponent } from "./gestion/gestion-equipos/gestion-equipos.component";
import { ProductoTerminadoTransferidoComponent } from "@pages/produccion/transferencia/producto-terminado-transferido/producto-terminado-transferido.component";

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
      {
        path: 'CompraDrogueria',
        component: OcDrogueriaComponent,
        data: {
          title: "Compra Drogueria"
        }
      },
      {
        path: 'CompraAguja',
        component: CompraAgujaComponent,
        data: {
         
        }
      },
      {
        path: 'CompraNacionalImportacion',
        component: CompraNacionalImportacionComponent,
        data: {
         
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

      {
        path: 'SeguimientoOC',
        component: SeguimientoOrdenCompraComponent,
        data: {
          title: "Seguimiento de la orden de compra"
        }
      },
      {
        path: 'Programacion',
        component: ProgramacionComponent,
        data: {
          title: "  "
        }
      },
      {
        path: 'EquiposPlanta',
        component: GestionEquiposComponent,
        data: {
          title: "  "
        }
      },
     
    ]
  },

  {
    path: 'Transferencia',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'ProductoTerminado',
        component: ProductoTerminadoTransferidoComponent,
        data: {
          title: "Transferencia Producto Teminado"
        }
      },
    ]
  }


]
