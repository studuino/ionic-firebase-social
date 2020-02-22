import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  toast: any;

  constructor(private router: Router, private fAuth: AngularFireAuth, private toastCtrl: ToastController) { }

  ngOnInit() {
  }

  login() {
    this.fAuth.auth.signInWithEmailAndPassword(this.email, this.password)
    .then((data => {
      console.log(data);

      this.toast = this.toastCtrl.create({
        message: 'Welcome ' + data.user.displayName,
        duration: 5000
      }).then((toastData) => {
        toastData.present();
      });
    
    })).catch((err => {
      console.log(err);

      this.toast = this.toastCtrl.create({
        message: err.message,
        duration: 5000
      }).then((toastData) => {
        toastData.present();
      });

    }))
  }

  gotoSignup() {
    this.router.navigateByUrl('/signup');
  }

}
