import { Component,inject} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(AuthService);
  //explicitly typed "router" to resolve "unknown" type error from "inject"
  router: Router = inject(Router);

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
    alert("Logged Out!!")
  }
}
