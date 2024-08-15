import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'sbk-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  private timeout!: number;
  constructor(private router: Router) {}
  ngOnInit() { this.timeout = window.setTimeout(() => this.router.navigate(['/scorer']), 5000) }
  ngOnDestroy() { window.clearTimeout(this.timeout) }
}