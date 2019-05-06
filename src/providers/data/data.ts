import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DataProvider {

  token:string = '*';
  sensorURL:string = 'https://portal.iamus.net:7777/auth/devices/sensor';
  valUrl:string = 'https://portal.iamus.net:7777';
  to:any = moment().valueOf();

  constructor(public http: HttpClient) {
  }

  getSensorList(){
    return this.http.get(this.sensorURL,{headers: new HttpHeaders({Authorization:'Token ' + this.token})});
  }

  getSensorData(timeFrame, tenant, device){
    let from = moment(this.to).subtract(24,'hours').valueOf();
    let requestUrl = this.valUrl + '/devicelog?tenant=' + tenant + '&device=' + device + '&from=' + from + '&to=' + this.to;
    return this.http.get(requestUrl);
  }

}
