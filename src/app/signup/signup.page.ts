import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  name = '';
  email = '';
  password = '';
  toast: any;
  alert: any;

  constructor(private router: Router, private fAuth: AngularFireAuth, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  signUp() {
    this.fAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then((data) => {

      console.log(data);

      let newUser = data.user;
      newUser.updateProfile({
        displayName: this.name,
        photoURL: ''
      }).then((res) => {
        console.log('Profile Updated');

        this.alert = this.alertCtrl.create({
          header: 'Account Created',
          message: 'Your account has been created successfully.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                // Navigate to the feeds page
              }
            }
          ]
        }).then((alertData) => {
          alertData.present();
        });

      }).catch((err) => {
        console.log(err);
      });

    })
    .catch((err) => {
      console.log(err);

      this.toast = this.toastCtrl.create({
        message: err.message,
        duration: 5000
      }).then((toastData) => {
        toastData.present();
      });

    });
  }

  goBack() {
    this.router.navigateByUrl('/login');
  }

}
