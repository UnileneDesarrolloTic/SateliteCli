import { FeatherModule } from "angular-feather";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LicitacionesRoutes } from "./licitaciones.routing";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { ComponenteModule } from "@shared/components/componente.module";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NuevoProcesoComponent } from './listar-proceso/nuevo-proceso/nuevo-proceso.component';
import { ListarProcesoComponent } from "./listar-proceso/listar-proceso.component";
import { DetalleProcesoComponent } from './listar-proceso/detalle-proceso/detalle-proceso.component';
import { DistribucionProcesoComponent } from './listar-proceso/distribucion-proceso/distribucion-proceso.component';


@NgModule({
  declarations: [NuevoProcesoComponent,ListarProcesoComponent, DetalleProcesoComponent, DistribucionProcesoComponent],
  imports: [
    RouterModule.forChild(LicitacionesRoutes),
    CommonModule,
    FeatherModule,
    ComponenteModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
  ],
  exports: [NuevoProcesoComponent,ListarProcesoComponent,DetalleProcesoComponent,DistribucionProcesoComponent],
})
export class LicitacionesModule { }
