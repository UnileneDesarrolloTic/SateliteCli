import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { CotizacionComponent } from "./cotizacion/cotizacion.component";
import { GeneracionFormatosComponent } from './cotizaciones/generacionformatos/generacionformatos.component';
import { DocumentoLicitacionesComponent } from "./documento-licitaciones/documento-licitaciones.component";
import { GuiasPorFacturarComponent } from "./guias-por-facturar/guias-por-facturar.component";
import { ProtocoloAnalisisComponent } from './protocoloanalisis/protocoloanalisis.component';
import { RotuladoPEDComponent } from "./rotulado-ped/rotulado-ped.component";

export const ComercialRoutes: Routes = [
  {
    path: 'cotizacion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'formatos',
        component: GeneracionFormatosComponent,
        data: {
          title: "Generación de Formatos",
          urls: [
            {title: 'Generación de Formatos' }
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
        path: 'ProtocoloAnalisis',
        component: ProtocoloAnalisisComponent,
        data: {
          title: "Protocolo de Análisis",
          urls: [
            {title: 'Protocolo de Análisis' }
          ]
        }
      },
    ]
  },
  
  {
    path: 'cotizacion',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'formulario',
        component: CotizacionComponent,
        data: {
          title: "Formulario Cotización",
          urls: [
            {title: 'Formulario Cotización' }
          ]
        }
      },
    ]
  },
  {
    path: 'licitaciones',
    canActivateChild: [AuthGuard],
    children : [
      {
        path: 'doclicitaciones',
        component: DocumentoLicitacionesComponent,
        data: {
          title: "Doc. Licitaciones",
          urls: [
            {title: 'Doc. Licitaciones' }
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
        path: 'RotuladoPED',
        component: RotuladoPEDComponent,
        data: {
          title: "Rotulado Pedido",
          urls: [
            {title: 'Rotulado Pedido' }
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
        path: 'guiaporfacturar',
        component: GuiasPorFacturarComponent,
        data: {
          title: "Guia por Facturar",
          urls: [
            {title: 'Guia por Facturar' }
          ]
        }
      },
    ]
  }

]
