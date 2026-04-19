import { Component } from '@angular/core';
import {MatBadge}  from '@angular/material/badge'
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [MatBadge,MatIcon,MatButton],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent{

}
