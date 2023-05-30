import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ConsultarStockVentasComponent } from "./consultar-stock-ventas/consultar-stock-ventas.component";
import { GestionGuiasComponent } from "./gestion-guias/gestion-guias.component";
import { OrdenesServicioDetalleComponent } from "./gestion-ordenes-servicio/ordenes-servicio-detalle/ordenes-servicio-detalle.component";
import { OrdenesServicioMainComponent } from "./gestion-ordenes-servicio/ordenes-servicio-main/ordenes-servicio-main.component";
import { MaestroItemComponent } from "./maestro-item/maestro-item.component";

export const LogisticaRoutes: Routes = [
  {
    path: 'MaestroItems',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'listar',
        component: MaestroItemComponent,
        data: {
          title: "Maestro de Item",
          urls: [
            { title: 'Maestro de Items' },
            { title: 'Logistica' }
            
          ]
        }
      },
      
    ]
  },
  {
    path: 'Gestion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'Guias',
        component: GestionGuiasComponent,
        data: {
          title: "Gestión de guias",
          urls: [
            { title: 'Gestión de guias' },
            { title: 'Logistica' }
            
          ]
        }
      },
      {
        path: 'ordenesServicio',
        component: OrdenesServicioMainComponent,
        data: {
          title: "Ordenes de servicio",
        },
      },
      {
        path: 'ordenesServicio/detalle/:codigo/:ordenServicio/:transportista',
        component: OrdenesServicioDetalleComponent,
        data: {
          title: "Detalle Orden Servicio",
          urls: [
            { title: 'Lista Orden Servicio', url: '//Logistica/Gestion/ordenesServicio' },
            { title: 'Detalle' }
          ]
        }
      },
      
    ]
  },
  {
    path: '',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'StockVentas',
        component: ConsultarStockVentasComponent,
        data: {
          title: "Consultar stock para ventas",
          urls: [
            { title: 'Consultar stock para ventas' },
            { title: 'Logistica' }
            
          ]
        }
      },
      
    ]
  },



]
