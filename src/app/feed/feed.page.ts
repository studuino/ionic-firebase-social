import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';

import { NavController, LoadingController, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import * as moment from 'moment';
import * as firebase from 'firebase';
import { HttpClient } from '@angular/common/http';

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
  image: string;

  constructor(private fStore: AngularFirestore, private user: UserService, private loadingCtrl: LoadingController,
              private toastCtrl: ToastController, private fAuth: AngularFireAuth, private navCtrl: NavController,
              private camera: Camera, private http: HttpClient, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) {

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

    const query = this.fStore.collection('posts').ref.orderBy('created', 'desc').limit(this.pageSize);

    this.refreshData(query);

    // query.onSnapshot((snapshot) => {
    //   // console.log('Changed');
    //   let changedDocs = snapshot.docChanges();
    //   changedDocs.forEach((change) => {

    //     if (change.type == 'added') {

    //     }

    //     if (change.type == 'modified') {
    //       // console.log('Document with id ' + change.doc.id + ' has been modified.');
    //       for (let i = 0; i< this.posts.length; i++) {
    //         if (this.posts[i].id == change.doc.id) {
    //           this.posts[i] = change.doc;
    //         }
    //       }
    //     }

    //     if (change.type == 'removed') {
          
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
    const query = this.fStore.collection('posts').ref.orderBy('created', 'desc').startAfter(this.cursor).limit(this.pageSize)
    
    this.refreshData(query);

    query.get()
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

    const newPostID = this.fStore.createId();

    //this.fStore.doc(`posts/${this.fStore.createId()}`).set({
    this.fStore.collection('posts').doc(newPostID).set({
      text: this.text,
      created: firestore.FieldValue.serverTimestamp(),
      uid: this.user.getUID(),
      username: this.user.getUserName()
    }).then(async (doc) => {

      console.log('postDoc:', doc);

      if (this.image) {
        await this.upload(newPostID);
      }

      this.text = '';
      this.image = undefined;

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

  addPhoto() {

    this.launchCamera();

  }

  launchCamera() {

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512,
      allowEdit: true
    }

    this.camera.getPicture(options).then((base64Image) => {
      console.log(base64Image);
      this.image = "data:image/png;base64," + base64Image;
     }, (err) => {
      console.log(err);
     });

  }

  upload(name: string) {

    return new Promise((resolve, reject) => {

      this.loadingCtrl.create({
        message: 'Uploading image...'
      }).then((load) => {
        load.present();
      });

      let ref = firebase.storage().ref('postImages/' + name);
  
      let uploadTask = ref.putString(this.image.split(',')[1], 'base64');
  
      uploadTask.on('state_changed', (taskSnapshot: any) => {
        console.log(taskSnapshot);

        // let percentage = taskSnapshot.bytesTransferred / taskSnapshot.totalBytes * 100;
        // this.loadingCtrl.message???change 'Uploaded ' + percentage + '%...';

      }, (error) => {
        console.log(error);
      }, () => {
        console.log('The upload is complete!');
  
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log(url);
  
          firebase.firestore().collection('posts').doc(name).update({
            image: url
          }).then(() => {
            this.loadingCtrl.dismiss();
            resolve();
          }).catch((err) => {
            this.loadingCtrl.dismiss();
            reject();
          });
        }).catch((err) => {
          this.loadingCtrl.dismiss();
          reject();
        });
      });
    });

  }

  like(post) {

    // console.log(post.data().likes[this.user.getUID()]);

    let body = {
      postId: post.id,
      userId: this.user.getUID(),
      action: post.data().likes && post.data().likes[this.user.getUID()] == true ? 'unlike' : 'like',
      // action: post.data().likes && post.data().likes[firebase.auth().currentUser.uid] == true ? "unlike" : "like"
    }

    this.toastCtrl.create({
      message: 'Updating like... Please wait.'
    }).then((toastData) => {
      toastData.present();
    });

    this.http.post('https://us-central1-socialdemo-d221a.cloudfunctions.net/updateLikesCount', JSON.stringify(body), {
      responseType: 'text'
    }).subscribe((data) => {
      console.log(data);
      this.toastCtrl.dismiss();
    }, (error) => {
      console.log(error);
      this.toastCtrl.dismiss();
    })
  }

  comment(post) {

    this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'View All Comments',
          handler: () => {
            //TODO
          }
        },
        {
          text: 'New Comment',
          handler: () => {
            this.alertCtrl.create({
              header: 'New Comment',
              message: 'Type your comment',
              inputs: [
                {
                  name: 'comment',
                  type: 'text'
                }
              ],
              buttons: [
                {
                  text: 'Cancel'
                },
                {
                  text: 'Post',
                  handler: (data) => {

                    if (data.comment) {

                      this.fStore.collection('comments').add({
                        text: data.comment,
                        post: post.id,
                        uid: this.user.getUID(),
                        username: this.user.getUserName(),
                        created: firestore.FieldValue.serverTimestamp()
                      }).then((doc) => {
                        this.toastCtrl.create({
                          message: 'Comment posted successfully.',
                          duration: 3000
                        }).then((toastData) => {
                          toastData.present();
                        });
                      }).catch((err) => {
                        this.toastCtrl.create({
                          message: err.message,
                          duration: 3000
                        }).then((toastData) => {
                          toastData.present();
                        });
                      })

                    }

                  }
                }
              ]
            }).then((alert) => {
              alert.present();
            });

          }
        }
      ]
    }).then((action) => {
      action.present();
    });

  }

  refreshData(query) {
    
    query.onSnapshot((snapshot) => {
      // console.log('Changed');
      let changedDocs = snapshot.docChanges();
      changedDocs.forEach((change) => {

        if (change.type == 'added') {

        }

        if (change.type == 'modified') {
          // console.log('Document with id ' + change.doc.id + ' has been modified.');
          for (let i = 0; i< this.posts.length; i++) {
            if (this.posts[i].id == change.doc.id) {
              this.posts[i] = change.doc;
            }
          }
        }

        if (change.type == 'removed') {
          
        }

      });
    });

  }

}
