import { PerfilComponent } from '@pages/cuenta/perfil/perfil.component';
import { CuentaRoutes } from './cuenta.routing';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PerfilComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(CuentaRoutes),
    ReactiveFormsModule
  ],
  exports: [
    PerfilComponent
  ]
})
export class CuentaModule { }
