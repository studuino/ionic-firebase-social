import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  name = '';
  email = '';
  password = '';

  constructor(private router: Router) { }

  ngOnInit() {
  }

  signUp() {
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    .then((user) => {
      console.log(user);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }

}
