import { Injectable } from '@angular/core';
import { REPLAYS } from './replays-mock';

@Injectable({
  providedIn: 'root'
})
export class ReplayService {
  getReplays() {
    return REPLAYS;
  }
  getReplayById(id: string) {
    return REPLAYS.find(replay => replay.id === id)
  }
}