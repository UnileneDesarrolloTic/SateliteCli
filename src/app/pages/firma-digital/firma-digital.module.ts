import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FirmaDigitalRoutes } from './firma-digital.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListarSolicitudComponent } from '@pages/firma-digital/listar-solicitud/listar-solicitud.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentosSolicitudComponent } from './documentos-solicitud/documentos-solicitud.component';
import { BandejaPendientesComponent } from './bandeja-pendientes/bandeja-pendientes.component';
import { FirmarDocumentoComponent } from './firmar-documento/firmar-documento.component';



@NgModule({
  declarations: [
    ListarSolicitudComponent,
    DocumentosSolicitudComponent,
    BandejaPendientesComponent,
    FirmarDocumentoComponent
  ],
  imports: [
    RouterModule.forChild(FirmaDigitalRoutes),
    CommonModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule
  ]
})
export class FirmaDigitalModule { }
