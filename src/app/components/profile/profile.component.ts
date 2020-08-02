import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  currentUser: any;
  loggedIn = false;

  constructor(private token: TokenStorageService) {}

  ngOnInit(): void {
    this.currentUser = this.token.getUser();
    if (this.currentUser) {
      this.loggedIn = true;
    }
  }
}
