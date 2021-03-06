import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController, AlertController } from '@ionic/angular';
import { UserService } from '../services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

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

  constructor(private navCtrl: NavController, private fAuth: AngularFireAuth, private toastCtrl: ToastController,
              private alertCtrl: AlertController, private user: UserService, private fStore: AngularFirestore) { }

  ngOnInit() {
  }

  signUp() {
    this.fAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
    .then((data) => {

      console.log(data);

      this.user.setUser({username: this.name, uid: data.user.uid});

      /*
      this.fStore.doc(`users/${data.user.uid}`).set({
        username: this.name
      });
      */

      const newUser = data.user;
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
                // this.router.navigateByUrl('/feed');
                this.navCtrl.navigateRoot('/feed');
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
    // this.router.navigateByUrl('/login');
    this.navCtrl.navigateBack('/login');
  }

}
