import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  public activeTab = 'dashboard';
  constructor() {}

  ngOnInit() {}
  handleActive(data) {
    this.activeTab = data;
  }
  logout() {
    localStorage.removeItem('credentials');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('id');
  }
}
