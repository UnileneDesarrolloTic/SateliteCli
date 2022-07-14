import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LogisticaRoutes } from "./logistica.routing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaestroItemComponent } from './maestro-item/maestro-item.component';


@NgModule({
  declarations:
  [ MaestroItemComponent],
  imports:
  [
    RouterModule.forChild(LogisticaRoutes),
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
    MaestroItemComponent
  ],
})
export class LogisticaModule { }
