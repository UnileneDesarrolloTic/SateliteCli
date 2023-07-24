import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TransferenciaPTComponent } from "@pages/encajado/transferencia-pt/transferencia-pt.component";
import { EncajadoRoutes } from "@pages/encajado/encajado.routing";

@NgModule({
  declarations:
  [ 
    TransferenciaPTComponent
  ],
  imports:
  [
    RouterModule.forChild(EncajadoRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  exports:
  [
  ],
})
export class EncajadoModule { }
