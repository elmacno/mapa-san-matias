import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isOpen: boolean = false;

  toggleSidemenu() {
    this.isOpen = !this.isOpen;
  }
}
