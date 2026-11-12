import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Empleado, EmpleadosResponse } from '../interfaces/empleado.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  private apiUrl = `${environment.apiUrl}/Carpetas/empleados`;

  constructor(private http: HttpClient) {}

  getActivos(): Observable<Empleado[]> {
      return this.http.get<EmpleadosResponse>(`${this.apiUrl}/activos`).pipe(
        map(respuesta => respuesta.empleados)
      )
    }
}
