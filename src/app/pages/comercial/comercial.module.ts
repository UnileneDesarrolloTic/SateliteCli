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

@NgModule({
  declarations: [GeneracionFormatosComponent, ProtocoloAnalisisComponent],
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
  exports: [GeneracionFormatosComponent, ProtocoloAnalisisComponent],
})
export class ComercialModule {}
