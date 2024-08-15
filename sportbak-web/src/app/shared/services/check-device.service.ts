import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export abstract class CheckDevice {
  public isMobile() {
    if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && window.innerWidth < 770) {
      return true;
    } else {
      return false;
    }
  }
}
