import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { CotizacionComponent } from "./cotizacion/cotizacion.component";
import { GeneracionFormatosComponent } from './cotizaciones/generacionformatos/generacionformatos.component';
import { ProtocoloAnalisisComponent } from './protocoloanalisis/protocoloanalisis.component';

export const ComercialRoutes: Routes = [
  {
    path: 'cotizacion',
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
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
]
