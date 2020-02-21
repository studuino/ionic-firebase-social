import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
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

  constructor(private router: Router, private fAuth: AngularFireAuth) { }

  ngOnInit() {
  }

  signUp() {
    this.fAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then((data) => {

      console.log(data);

      let newUser: firebase.User = data.user;
      newUser.updateProfile({
        displayName: this.name,
        photoURL: ''
      }).then((res) => {
        console.log('Profile Updated');
      }).catch((err) => {
        console.log(err);
      });

    })
    .catch((err) => {
      console.log(err);
    });
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }

}
