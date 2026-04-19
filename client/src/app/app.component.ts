import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./layout/header/header.component";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  standalone:true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  baseUrl='http://localhost:5000/api/';
  private http=inject(HttpClient);
title = 'client';
ngOnInit(): void {
  this.http.get(this.baseUrl+'products').subscribe({
    next:data=>{
 console.log(data)
    },
    error:error=>console.log(error),
    complete:()=>console.log('complete')
  })
}
}