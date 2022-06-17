import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar-pruebas',
  templateUrl: './navbar-pruebas.component.html'
})
export class NavbarPruebasComponent implements OnInit, OnDestroy{

  page: string = "Personal";
  clientesSubscription:Subscription;

  constructor(private router: Router, private route: ActivatedRoute){}

  ngOnInit() {

    this.clientesSubscription = this.router.events
        .subscribe(() => {
            let currentRoute = this.route.root;
            while (currentRoute.children[0] !== undefined)
                currentRoute = currentRoute.children[0];
            this.page = currentRoute.snapshot.data["pruebaTitle"]
        })

  }

  ngOnDestroy(): void {
    this.clientesSubscription.unsubscribe();
  }

}
