import { Injectable } from "@angular/core";
import { FEED } from "./feed-mock";
import { Feed } from "./feed.model";

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  getFeed(): Feed {
    return FEED
  }
}