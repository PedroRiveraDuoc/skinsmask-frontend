import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavComponent } from '../../../shared/nav/navbar/navbar.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, NavComponent],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {}
