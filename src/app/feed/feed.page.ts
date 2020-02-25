import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '../services/user.service';
import { firestore } from 'firebase/app';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  text = '';
  posts: any[] = [];

  constructor(private fStore: AngularFirestore, private user: UserService) {

    this.getPosts();

  }

  ngOnInit() {
  }

  getPosts() {

    this.posts = [];

    const docref = this.fStore.collection('posts');
    docref.ref.get()
    .then((docs) => {
      docs.forEach((doc) => {
        this.posts.push(doc);
      });

      console.log(this.posts);

    }).catch((err) => {
      console.log(err);
    });
  }

  post() {
    // console.log(this.user.getUser());
    this.fStore.doc(`posts/${this.fStore.createId()}`).set({
      text: this.text,
      created: firestore.FieldValue.serverTimestamp(),
      uid: this.user.getUID(),
      username: this.user.getUserName()
    }).then((doc) => {

      console.log(doc);
      this.getPosts();

    }).catch((err) => {
      console.log(err);
    });

  }

}
