import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  toast: any;

  constructor(private navCtrl: NavController, private fAuth: AngularFireAuth,
              private toastCtrl: ToastController, private user: UserService) { }

  ngOnInit() {
  }

  login() {
    this.fAuth.auth.signInWithEmailAndPassword(this.email, this.password)
    .then((data => {
      console.log(data);

      this.user.setUser({username: data.user.displayName, uid: data.user.uid});

      this.toast = this.toastCtrl.create({
        message: 'Welcome ' + data.user.displayName,
        duration: 5000
      }).then((toastData) => {
        toastData.present();
      });

      // this.router.navigateByUrl('/feed');
      this.navCtrl.navigateRoot('/feed');

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
    // this.router.navigateByUrl('/signup');
    this.navCtrl.navigateForward('/signup');
  }

}
