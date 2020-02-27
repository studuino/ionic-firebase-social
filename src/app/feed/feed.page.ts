import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { firestore } from 'firebase/app';
import * as moment from 'moment';
import { ToastController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  text = '';
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  isLoading = false;

  constructor(private fStore: AngularFirestore, private user: UserService, private loadingCtrl: LoadingController,
              private toastCtrl: ToastController, private fAuth: AngularFireAuth, private navCtrl: NavController) {

    this.getPosts();

  }

  ngOnInit() {
  }

  getPosts() {

    this.posts = [];

    this.isLoading = true;
    this.loadingCtrl.create({
      message: 'Loading Feed...'
    }).then((load) => {
      load.present().then(() => {
        console.log('loading presented');
        if (!this.isLoading) {
          load.dismiss().then(() => console.log('abort loading'));
        }
      });
    });

    const docref = this.fStore.collection('posts');
    const query = docref.ref.orderBy('created', 'desc').limit(this.pageSize);

    // query.onSnapshot((snapshot) => {
    //   // console.log('Changed');
    //   let changedDocs = snapshot.docChanges();
    //   changedDocs.forEach((change) => {

    //     if(change.type == 'added') {

    //     }

    //     if(change.type == 'modified') {

    //     }

    //     if(change.type == 'removed') {

    //     }

    //   });
    // });

    query.get()
    .then((docs) => {
      docs.forEach((doc) => {
        this.posts.push(doc);
      });

      this.isLoading = false;
      this.loadingCtrl.dismiss().then(() => console.log('loading dismissed'));

      this.cursor = this.posts[this.posts.length - 1];

      console.log('getPosts:', this.posts);

    }).catch((err) => {
      console.log(err);
    });
  }

  loadMorePosts(event) {
    const docref = this.fStore.collection('posts');
    docref.ref.orderBy('created', 'desc').startAfter(this.cursor).limit(this.pageSize).get()
    .then((docs) => {
      docs.forEach((doc) => {
        this.posts.push(doc);
      });

      console.log('loadMorePosts:', this.posts);

      setTimeout(() => {
        console.log('Done');
        event.target.complete();
        this.cursor = this.posts[this.posts.length - 1];
      }, 500);

    }).catch((err) => {
      console.log(err);
    });
  }

  doRefresh(event) {

    console.log('Begin async operation');

    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
      this.getPosts();
    }, 500);

  }

  post() {
    this.fStore.doc(`posts/${this.fStore.createId()}`).set({
      text: this.text,
      created: firestore.FieldValue.serverTimestamp(),
      uid: this.user.getUID(),
      username: this.user.getUserName()
    }).then((doc) => {

      console.log(doc);

      this.text = '';

      this.toastCtrl.create({
        message: 'Your post has been created successfully.',
        duration: 5000
      }).then((toastData) => {
        toastData.present();
      });

      this.getPosts();

    }).catch((err) => {
      console.log(err);
    });
  }

  ago(time) {
    const difference = moment(time).diff(moment());
    return moment.duration(difference).humanize();
  }

  logout() {
    this.fAuth.auth.signOut().then(() => {

      this.toastCtrl.create({
        message: 'You have been logged out successfully.',
        duration: 5000
      }).then((toastData) => {
        toastData.present();
      });

      this.navCtrl.navigateRoot('/login');
    });
  }

}
