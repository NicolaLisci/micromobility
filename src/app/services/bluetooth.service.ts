import { Injectable } from '@angular/core';
import { map, mergeMap } from 'rxjs/operators';
import { BluetoothCore } from '@manekinekko/angular-web-bluetooth';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  static GATT_CHARACTERISTIC_BATTERY_LEVEL = 'battery_level';
  static GATT_PRIMARY_SERVICE = 'battery_service';
  
  public deviceName$ = new Subject();
  
  constructor(public readonly ble: BluetoothCore) {}
  
  getDevice() {
    // call this method to get the connected device
    console.log('here')
    return this.ble.getDevice$();
  }
  
  stream() {
    // call this method to get a stream of values emitted by the device for a given characteristic
    return this.ble.streamValues$().pipe(
      map((value: DataView) => value.getInt8(0))
      );
    }
    
    disconnectDevice() {
      // call this method to disconnect from the device. This method will also stop clear all subscribed notifications
      this.ble.disconnectDevice();
    }
    
    value() {
      console.log('Getting Battery level...');
      
      return this.ble
      
      // 1) call the discover method will trigger the discovery process (by the browser)
      .discover$({
        acceptAllDevices: true,
      }).subscribe((res:any)=>{
        console.log(res.device.name);
        this.deviceName$.next(res.device.name);
      })
    }
  }
  