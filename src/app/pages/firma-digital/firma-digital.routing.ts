import { Routes } from "@angular/router";
import { AuthGuard } from "@guard/auth.guard";
import { ListarSolicitudComponent } from '@pages/firma-digital/listar-solicitud/listar-solicitud.component';
import { DocumentosSolicitudComponent } from "@pages/firma-digital/documentos-solicitud/documentos-solicitud.component";
import { BandejaPendientesComponent } from "@pages/firma-digital/bandeja-pendientes/bandeja-pendientes.component";
import { FirmarDocumentoComponent } from "./firmar-documento/firmar-documento.component";

export const FirmaDigitalRoutes: Routes = [
    {
        path: '',
        canActivateChild: [AuthGuard],
        children : [
          {
            path: 'Solicitudes',
            component: ListarSolicitudComponent,
          },
          {
            path: 'DocumentosSolicitud/:idSolicitud',
            component: DocumentosSolicitudComponent,
            data: {
              title: "Documentos"
            }
          },
          {
            path: 'BandejaPendientes',
            component: BandejaPendientesComponent,
            data: {
              title: "Documentos pendientes de firma"
            }
          },
          {
            path: 'FirmarDocumento/:idSolicitud',
            component: FirmarDocumentoComponent,
            data: {
              title: "Firmar documentos"
            }
          },
        ]
    },
]