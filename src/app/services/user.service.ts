import { Injectable } from '@angular/core';

interface User {
  username: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user: User;

  constructor() { }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  getUID() {
    return this.user.uid;
  }

  getUserName() {
    return this.user.username;
  }
}
