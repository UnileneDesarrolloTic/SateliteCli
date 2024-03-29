import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ComercialRoutes } from "./comercial.routing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { ComponenteModule } from "@shared/components/componente.module";
import { GeneracionFormatosComponent } from "@pages/comercial/cotizaciones/generacionformatos/generacionformatos.component";
import { ProtocoloAnalisisComponent } from "@pages/comercial/protocoloanalisis/protocoloanalisis.component";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CotizacionComponent } from './cotizacion/cotizacion.component';
import { ModalDocumentoCotizacionComponent } from './cotizacion/modal-documento-cotizacion/modal-documento-cotizacion.component';
import { ModalDescargaCotizacionComponent } from './cotizacion/modal-descarga-cotizacion/modal-descarga-cotizacion.component';

import { ModalAgregarCotizacionComponent } from './cotizacion/modal-agregar-cotizacion/modal-agregar-cotizacion.component';
import { FormatoCotizacionComponent } from './cotizacion/formato-cotizacion/formato-cotizacion.component';
import { DocumentoLicitacionesComponent } from './documento-licitaciones/documento-licitaciones.component';
import { RotuladoPEDComponent } from './rotulado-ped/rotulado-ped.component';
import { GuiasPorFacturarComponent } from './guias-por-facturar/guias-por-facturar.component';
import { GestionGuiasComponent } from './gestion-guias/gestion-guias.component';

@NgModule({
  declarations: [GeneracionFormatosComponent, 
                 ProtocoloAnalisisComponent, 
                 CotizacionComponent, 
                 ModalDocumentoCotizacionComponent, 
                 ModalDescargaCotizacionComponent, 
                 ModalAgregarCotizacionComponent, 
                 FormatoCotizacionComponent, 
                 DocumentoLicitacionesComponent, 
                 RotuladoPEDComponent,
                 GuiasPorFacturarComponent,
                 GestionGuiasComponent],
  imports: [
    RouterModule.forChild(ComercialRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  exports: [GeneracionFormatosComponent, 
            ProtocoloAnalisisComponent, 
            ModalDocumentoCotizacionComponent, 
            ModalDescargaCotizacionComponent, 
            FormatoCotizacionComponent,
            RotuladoPEDComponent,
            GuiasPorFacturarComponent
            ],
})
export class ComercialModule { }
