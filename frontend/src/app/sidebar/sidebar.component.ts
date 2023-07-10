import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() buttonClick = new EventEmitter<string>();

  constructor(private route: Router){
  }

  onButtonClick(buttonName: string) {
    this.buttonClick.emit(buttonName);
    this.route.navigate(['/editing']);
  }
  
}
