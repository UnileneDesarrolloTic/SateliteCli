import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ConfirmExitGuard } from "@guard/confirm-exit.guard";
import { AnalisiscostosListaprecioComponent } from "./analisiscostos-listaprecio/analisiscostos-listaprecio.component";
import { CierreContableComponent } from "./cierre-contable/cierre-contable.component";
import { FormularioCierreContableComponent } from "./cierre-contable/formulario-cierre-contable/formulario-cierre-contable.component";
import { DetraccionesComponent } from "./detracciones/detracciones.component";

export const ContabilidadRoutes: Routes = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'Detraccion',
        component: DetraccionesComponent,
        data: {
          title: "Declaración de detracción al: "+ (new Date().toLocaleString("es-Cl")).substring(0,10) ,
          urls: [
            {title: 'Detracción' }
          ]
        }
      },
      {
        path: 'AnalisisCosto',
        component: AnalisiscostosListaprecioComponent,
        data: {
          title: "Análisis de Costo y Lista de Precios",
          urls: [
            {title: 'Detracción' }
          ]
        }
      },
     
    ]
  },
  {
    path: 'CierreContable',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'Reporte',
        canDeactivate: [ConfirmExitGuard],
        component: CierreContableComponent,
        data: {
          title: "Cierre Contable",
         
        },
      },
      {
        path: ':Codigo',
        canDeactivate: [ConfirmExitGuard],
        component: FormularioCierreContableComponent,
        data: {
          title: "Formulario Cierre Contable",
          urls: [
            { title: 'Contabilidad', url: '/Contabilidad/CierreContable/Reporte'},
            { title: 'Contabilidad' }
          ]
        },
      },
      
    ]
  },


]
