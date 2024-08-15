import { Component } from "@angular/core";
import { Feed } from "./feed.model";
import { FeedService } from "./feed.service";

@Component({
  selector: 'feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent {

  feed: Feed

  constructor(feedService: FeedService) {
    this.feed = feedService.getFeed()
  }
}