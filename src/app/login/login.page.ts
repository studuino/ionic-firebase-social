import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';

  constructor(private router: Router, private fAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  login() {
    this.fAuth.auth.signInWithEmailAndPassword(this.email, this.password)
    .then((user => {
      console.log(user);
    })).catch((err => {
      console.log(err);
    }))
  }

  gotoSignup() {
    this.router.navigateByUrl('/signup');
  }

}
