import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-tracing-home',
  templateUrl: './contact-tracing-home.component.html',
  styleUrls: ['./contact-tracing-home.component.scss'],
})
export class ContactTracingHomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  goToSignup() {
    this.router.navigate(['/register', { plan: 'contact-tracing' }]);
  }
}
