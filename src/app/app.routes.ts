import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { FormularioComponent } from './components/formulario/formulario.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'inicio', component: InicioComponent},
    {path: 'formulario', component: FormularioComponent}
];
