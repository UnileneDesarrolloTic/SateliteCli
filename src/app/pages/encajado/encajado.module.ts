import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { AvanceComponent } from "@pages/encajado/avance/avance.component";
import { EncajadoRoutes } from "@pages/encajado/encajado.routing";

@NgModule({
  declarations:
  [ 
    AvanceComponent
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
