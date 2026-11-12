import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FirmaComponent } from '../firma/firma.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed  } from '@angular/core/rxjs-interop';
import { Empleado } from '../../interfaces/empleado.model';
import { EmpleadosService } from '../../services/empleados.service';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [InputTextModule, CalendarModule, FieldsetModule, InputTextareaModule, FirmaComponent, ReactiveFormsModule, CheckboxModule, DropdownModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {

  //lista para el desplegable y empleado elegido
  empleados: Empleado[] = [];
  empleadoSeleccionado?: Empleado;

  //datos agrupados que se enviaran al backend
  formulario = new FormGroup({

    //Datos generales
    fecha: new FormControl<Date | null>(null, Validators.required),
    area: new FormControl('', Validators.required),
    responsable: new FormControl('', Validators.required),
    trabajador: new FormControl<number | null>(null, Validators.required),
    posicion: new FormControl('', Validators.required),
    fechaAntiguedad: new FormControl<Date | null>(null, Validators.required),

    //seguimiento del trabajo y prioridades
    estadoProyecto: new FormControl('', Validators.required),
    dificultadAvance: new FormControl('', Validators.required),

    // feedback del manager
    puntosFuertes: new FormControl('', Validators.required),
    aDesarrollar: new FormControl('', Validators.required),

    //feedback hacia el manager
    queFuncionaBien: new FormControl('', Validators.required),
    quePuedeMejorar: new FormControl('', Validators.required),

    //desarrollo profesional
    visionCuatroAnyos: new FormControl('', Validators.required),
    habilidadesDesarrollar: new FormControl('', Validators.required),

    // bienestar y motivacion
    bienestarMotivacion: new FormControl('', Validators.required),

    //objetivos y desempeño
    objetivosIndividuales: new FormControl('', Validators.required),
    metasIndividuales: new FormControl('', Validators.required),
    objetivosArea: new FormControl('', Validators.required),
    kpis: new FormControl('', Validators.required),

    //necesita formacion
    necesitaFormacion: new FormControl(false, { nonNullable: true }),
    formacion: new FormControl({ value: '', disabled: true }, Validators.required),

    //firmas (base64)
    firmaResponsable: new FormControl<string | null>(null, Validators.required),
    firmaTrabajador: new FormControl<string | null>(null, Validators.required)

  });
  firmaResponsable: string | null = null;
  firmaTrabajador: string | null = null;

  constructor(private empleadosService: EmpleadosService){
    this.formulario.controls.necesitaFormacion.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe(necesita => {
      const formacion = this.formulario.controls.formacion;
      if(necesita){
        //pasa a validarse
        formacion.enable();
      }else{
        //borra lo que hubiese escrito
        formacion.reset('');
        //deja de validarse
        formacion.disable();
      }
    });
  }

  ngOnInit(): void {
    this.empleadosService.getActivos().subscribe({
      next: empleados => this.empleados = empleados,
      error: err => console.log('Error al cargar empleados: ' + err)
    });
  }

  //Al elegir un trabajador se rellenar los campos:
  seleccionTrabajador(idEmpleado: number): void{
    this.empleadoSeleccionado = this.empleados.find(e => e.id === idEmpleado);
    if(!this.empleadoSeleccionado) return;

    this.formulario.patchValue({
      responsable: this.empleadoSeleccionado.idManager?.toString() ?? '',
      area: this.empleadoSeleccionado.area ?? '',
      posicion: this.empleadoSeleccionado.posicion ?? '',
      fechaAntiguedad: this.empleadoSeleccionado.fechaInicioAntiguedad ? new Date(this.empleadoSeleccionado.fechaInicioAntiguedad) : null
    });

  }

  guardar(): void{
    if(this.formulario.invalid){
      this.formulario.markAllAsTouched(); // muestra los errores de los campos
      return;
    }

    //incluimos los campos desactivados como por ejemplo, formacion si esta vacio.
    const datos = this.formulario.getRawValue();
    //probamos en consola si llegan los datos
    console.log(datos);
  }
}
