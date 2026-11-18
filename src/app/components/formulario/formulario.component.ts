import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { OnetooneService } from '../../services/onetoone.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [InputTextModule, CalendarModule, FieldsetModule, InputTextareaModule, FirmaComponent, ReactiveFormsModule, CheckboxModule, DropdownModule, ToastModule],
  providers: [MessageService],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent implements OnInit {

  //lista para el desplegable y empleado elegido
  empleados: Empleado[] = [];
  empleadoSeleccionado?: Empleado;
  areas: string[] = [];
  guardando = false;
  firmaResponsable: string | null = null;
  firmaTrabajador: string | null = null;


  //Referencia para los dos campos de las firmas
  @ViewChildren(FirmaComponent) firmas!: QueryList<FirmaComponent>;


  //datos agrupados que se enviaran al backend
  formulario = new FormGroup({

    //Datos generales
    fecha: new FormControl<Date | null>(null, Validators.required),
    area: new FormControl('', Validators.required),
    idManager: new FormControl<number | null>(null, Validators.required),
    idEmpleado: new FormControl<number | null>(null, Validators.required),
    posicion: new FormControl('', Validators.required),
    fechaAntiguedad: new FormControl<Date | null>(null, Validators.required),

    //seguimiento del trabajo y prioridades
    estadoTareasProyectos: new FormControl('', Validators.required),
    dificultadesAvance: new FormControl('', Validators.required),

    // feedback del manager
    puntosFuertes: new FormControl('', Validators.required),
    areaDesarrollar: new FormControl('', Validators.required),

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
    //sugerencia
    tieneSugerencia: new FormControl(false, { nonNullable: true }),
    quejaSugerencia: new FormControl({ value: '', disabled: true }, Validators.required),

    //firmas (base64)
    firmaResponsable: new FormControl<string | null>(null, Validators.required),
    firmaTrabajador: new FormControl<string | null>(null, Validators.required)

  });

  //constructor
  constructor(private empleadosService: EmpleadosService, private onetooneService: OnetooneService, private messageService: MessageService){
    //formacion
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

    //sugerencia
    this.formulario.controls.tieneSugerencia.valueChanges
    .pipe(takeUntilDestroyed())
    .subscribe(inquietud => {
      const quejaSugerencia = this.formulario.controls.quejaSugerencia;
      if(inquietud)
      {
        quejaSugerencia.enable();
      }else{
        quejaSugerencia.reset('');
        quejaSugerencia.disable();
      }
    })
  }

  ngOnInit(): void {
    //carga de empleados
    this.empleadosService.getActivos().subscribe({
      next: empleados => this.empleados = empleados,
      error: err => console.log('Error al cargar empleados: ' + err)
    });
    //carga de areas
    this.empleadosService.getAReas().subscribe({
      next: areas => this.areas = areas,
      error: err => console.log('Error al cargar las areas: ' + err)
    });
  }

  //Al elegir un trabajador se rellenar los campos:
  seleccionTrabajador(idEmpleado: number): void{
    this.empleadoSeleccionado = this.empleados.find(e => e.id === idEmpleado);
    if(!this.empleadoSeleccionado) return;

    this.formulario.patchValue({
      idManager: this.empleadoSeleccionado.idManager ?? null,
      posicion: this.empleadoSeleccionado.posicion ?? '',
      fechaAntiguedad: this.empleadoSeleccionado.fechaInicioAntiguedad ? new Date(this.empleadoSeleccionado.fechaInicioAntiguedad) : null
    });

  }

  guardar(): void{
    if(this.formulario.invalid){
      //TEMPORAL
      console.log('Campos invalidos: ', Object.keys(this.formulario.controls)
    .filter(nombre => this.formulario.get(nombre)?.invalid));
      this.formulario.markAllAsTouched(); // muestra los errores de los campos
      this.messageService.add({ severity: 'warn', summary:'Formulario Incompleto', detail: 'Revisa los campos en rojo' });
      return;
    }

    const { tieneSugerencia, quejaSugerencia, necesitaFormacion, formacion, fecha, fechaAntiguedad, ...resto} = this.formulario.getRawValue();

    //incluimos los campos desactivados como por ejemplo, formacion si esta vacio.
    const datos = {
      ...resto,
      fecha: this.fechaSinHora(fecha),
      fechaAntiguedad: this.fechaSinHora(fechaAntiguedad),
      formacion: necesitaFormacion ? formacion : null,
      quejaSugerencia: tieneSugerencia ? quejaSugerencia : null
    };

    this.guardando = true;

    this.onetooneService.insertarFormulario(datos).subscribe({
      next: respuesta => {
        this.guardando = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: `One-to-one guardada (nº ${respuesta.idFormularioOneToOne})`
        });
        this.formulario.reset();
        this.empleadoSeleccionado = undefined;
        this.firmas.forEach(firma => firma.borrar());
      },
      error: err => {
        this.guardando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error al guardar',
          detail: err.error?.mensaje ?? 'Inténtalo de nuevo'
        });
      }
    });
  }

  private fechaSinHora(fecha: Date | null): string | null
  {
    return fecha ? formatDate(fecha, 'yyyy-MM-dd', 'en-US') : null;
  }
}
