import { networkInterfaces } from 'os';
import dns from 'dns';
import axios from 'axios';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
/*import usb from 'usb-detection';

export interface USBDeviceEvent {
  type: 'add' | 'remove';
  device: any;
}*/

export class StatusService {

  /*private USBDeviceEvent = new Subject<USBDeviceEvent>();

  constructor() { 
    usb.find().then(device => this.USBDeviceEvent.next({ type: 'add',  device: device }));
    usb.on('add', device => this.USBDeviceEvent.next({ type: 'add',  device: device }));
    usb.on('remove', device => this.USBDeviceEvent.next({ type: 'remove',  device: device }));
  }*/

  private getNetworkInterfaces(externalOnly = false) {
    const networks = networkInterfaces();
    const results = {};
    for (const name of Object.keys(networks)) {
      for (const net of networks[name]) {
        if (net.family === 'IPv4' && ((externalOnly && !net.internal) || !externalOnly)) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }
    //console.log("NETWORK INTERFACES - externalOnly : " + externalOnly + " - Result : ", results);
    return results;
  }

  getLocalIPAddress() {
    const results = this.getNetworkInterfaces(true);
    let ip = null;

    if (results['external'] && results['external'].length) {
      ip = results['external'][0];
    } else {
      let names = Object.keys(results);
      if (names.length) {
        if (results[names[0]].length) {
          ip  = results[names[0]][0];
        }
      }
    }
    return ip;
  }

  getVpnIpAddress() {
    const results = this.getNetworkInterfaces();
    let ip = null;
    if (results['tun0'] && results['tun0'].length) {
      ip = results['tun0'][0];
    }
    return ip;
  }

  async getInternetConnection() {
    return new Promise<boolean>(resolve => {
      dns.lookupService('8.8.8.8', 53, function(err, hostname, service) {
        if (err) return resolve(false);
        return resolve(true);
      });
    });
  }

  async getEstimatedDownloadRate() {
    const res = 'https://sportbak.com/assets/video/statistics-en.mp4';
    const size = 10.5;
    const startTime = Date.now();
    await axios.get(res);
    const elapsedTime = Date.now() - startTime;
    return elapsedTime == 0 ? 0 : size / (elapsedTime / 1000);
  }

  /*pollUSBDevices() {
    return this.USBDeviceEvent.asObservable();
  }*/

  destroy() {
  }
}