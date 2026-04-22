import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-test-error',
  standalone:true,
  imports: [MatButton],
  templateUrl: './test-error.component.html',
  styleUrl: './test-error.component.css',
})
export class TestErrorComponent implements OnInit {
  baseUrl="http://localhost:5000/api"
  private http=inject(HttpClient)
  validationError?=[];
ngOnInit(): void {
  
}
get500InternalError(){
this.http.get(this.baseUrl+'/buggy/internalerror').subscribe({
  next:response=>console.log(response),
  error:error=>console.log(error)
})
}
get400BadRequest(){
this.http.get(this.baseUrl+'/buggy/badrequest').subscribe({
  next:response=>console.log(response),
  error:error=>console.log(error)
})
}

get404NotfoundError(){
this.http.get(this.baseUrl+'/buggy/notfound').subscribe({
  next:response=>console.log(response),
  error:error=>console.log(error)
})
}
get401unauthorized(){
this.http.get(this.baseUrl+'/buggy/unauthorized').subscribe({
  next:response=>console.log(response),
  error:error=>console.log(error)
})
}
get405ValidationError(){
this.http.post(this.baseUrl+'/buggy/validationerror',{}).subscribe({
  next:response=>console.log(response),
  error:error=>this.validationError=error
})
}
get400InternalError(){
this.http.get(this.baseUrl+'/buggy/notfound').subscribe({
  next:response=>console.log(response),
  error:error=>console.log(error)
})
}
}
