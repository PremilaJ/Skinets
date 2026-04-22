import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  imports: [],
  templateUrl: './server-error.component.html',
  styleUrl: './server-error.component.css',
})
export class ServerErrorComponent {
error:any;
constructor(private route:Router){
  const navigation=history.state;
  this.error=navigation.error;
  
}
}
