import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { FirmaComponent } from '../firma/firma.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [InputTextModule, CalendarModule, FieldsetModule, InputTextareaModule, FirmaComponent, ReactiveFormsModule, CheckboxModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent {

  formulario = new FormGroup({


    //necesita formacion
    necesitaFormacion: new FormControl(false, { nonNullable: true }),
    formacion: new FormControl({ value: '', disabled: true }, Validators.required),

  });
  firmaResponsable: string | null = null;
  firmaTrabajador: string | null = null;

  constructor(){
    
    this.formulario.controls.necesitaFormacion.valueChanges
  }

  guardar(): void{
    console.log('guardado')
  }
}
