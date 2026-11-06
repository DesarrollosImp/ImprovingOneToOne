import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from "primeng/password";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [StyleClassModule,InputTextModule,ButtonModule,PasswordModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
