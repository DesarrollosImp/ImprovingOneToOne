import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { OneToOneDetalle, OneToOneGuardarResponse, OneToOneResumen } from '../interfaces/onetoone.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnetooneService {

  private apiUrl = `${environment.apiUrl}/OneToOne`;

  constructor(private http: HttpClient) { }

  insertarFormulario(datos: unknown): Observable<OneToOneGuardarResponse>
  {
    return this.http.post<OneToOneGuardarResponse>(this.apiUrl, datos);
  }

  obtenerFormularioResumen(): Observable<OneToOneResumen[]>
  {
    return this.http.get<{ oneToOnes: OneToOneResumen[] }>(this.apiUrl)
    .pipe(map( respuesta => respuesta.oneToOnes));
  }

  obtenerFormularioCompleto(idFormularioOneToOne: number): Observable<OneToOneDetalle>
  {
    return this.http.get<OneToOneDetalle>(`${this.apiUrl}/${idFormularioOneToOne}`);
  }
}
