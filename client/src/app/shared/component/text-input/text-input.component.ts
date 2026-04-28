import { NgComponentOutlet } from '@angular/common';
import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { MatError, MatFormField, MatInput, MatInputModule, MatLabel } from '@angular/material/input';

@Component({
  selector: 'app-text-input',
  imports: [ReactiveFormsModule,MatInput,MatLabel,MatFormField,MatInputModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.css',
})
export class TextInputComponent implements ControlValueAccessor{
@Input() label='';
@Input() type='text';
constructor(@Self () public controlDir:NgControl ){
  this.controlDir.valueAccessor=this;
}
  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
    
  }
  registerOnTouched(fn: any): void {
    
  }
  get control(){
    return this.controlDir.control as FormControl
  }
}
