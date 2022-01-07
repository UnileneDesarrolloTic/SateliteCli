import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarterComponent } from '@pages/home/starter.component';

// Los PATH de las rutas tiene que ir con minuscula
const routes: Routes = [
  {
    path: '',
    component: StarterComponent,
    //canActivate: [AuthGuard],
    data: {
      title: 'Página Principal',
      urls: [
        { title: 'Principal' }
      ]
    }
  }
];


@NgModule({
  declarations: [StarterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class StarterModule { }
