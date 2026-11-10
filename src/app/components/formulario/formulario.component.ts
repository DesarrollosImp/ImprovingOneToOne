import { Component, Input } from '@angular/core';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { FieldsetModule } from 'primeng/fieldset';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FirmaComponent } from '../firma/firma.component';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [InputTextModule, CalendarModule, FieldsetModule, InputTextareaModule, FirmaComponent],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.scss'
})
export class FormularioComponent {
  firmaResponsable: string | null = null;
  firmaTrabajador: string | null = null;
}
