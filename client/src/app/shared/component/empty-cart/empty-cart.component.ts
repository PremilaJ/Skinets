import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor } from "@angular/material/button";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-empty-cart',
  imports: [MatIcon, MatAnchor, RouterLink],
  templateUrl: './empty-cart.component.html',
  styleUrl: './empty-cart.component.css',
})
export class EmptyCartComponent {

}
