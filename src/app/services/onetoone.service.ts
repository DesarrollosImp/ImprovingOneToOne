import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OneToOneGuardarResponse } from '../interfaces/onetoone.model';
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
}
