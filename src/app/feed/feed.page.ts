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

  constructor(private fStore: AngularFirestore, private user: UserService) { }

  ngOnInit() {
  }

  post() {
    // console.log(this.user.getUser());
    this.fStore.doc(`posts/${this.fStore.createId()}`).set({
      text: this.text,
      created: firestore.FieldValue.serverTimestamp(),
      uid: this.user.getUID(),
      username: this.user.getUserName()
    });

  }

}
