import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  text = '';

  constructor(private fireStore: AngularFirestore) { }

  ngOnInit() {
  }

  post() {
    this.fireStore.collection.
  }

}
