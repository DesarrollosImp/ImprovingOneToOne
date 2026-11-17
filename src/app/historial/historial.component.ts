import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { OneToOneDetalle, OneToOneResumen } from '../interfaces/onetoone.model';
import { OnetooneService } from '../services/onetoone.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [TooltipModule, ToolbarModule, ButtonModule, TableModule, RippleModule, InputTextModule, TagModule, ToastModule, DatePipe, RouterLink],
  providers: [MessageService],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss'
})
export class HistorialComponent implements OnInit{
  oneToOnes: OneToOneResumen[] = [];
  cargando = true;

  mostrarDetalle = false;
  cargandoDetalle = false;
  detalle?: OneToOneDetalle;

  constructor(
    private onetooneService: OnetooneService,
    private messageService: MessageService
  ){}


  // al abrir la pagina cargamos la lista
  ngOnInit(): void {
    this.onetooneService.obtenerFormularioResumen().subscribe({
      next: formularios => {
        this.oneToOnes = formularios;
        this.cargando = false;
      },
      error: err => {
        this.cargando = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.mensaje ?? 'No se pudo cargar el historial'
        });
      }
    });
  }

  //pulsar para ver el detalle
  verDetalle(fila: OneToOneResumen): void {
    this.cargandoDetalle = true;
    this.onetooneService.obtenerFormularioCompleto(fila.idFormularioOneToOne).subscribe({
      next: formularios => {
        this.detalle = formularios;
        this.mostrarDetalle = true;
        this.cargandoDetalle = false;
      },
      error: err => {
        this.cargandoDetalle = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.mensaje ?? 'No se pudo abrir el detalle de la one-to-one'
        });
      }
    });
  }

}
