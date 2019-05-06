import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController, Select} from 'ionic-angular';
import {appendNgModuleExports} from "@ionic/app-scripts/dist/util/typescript-utils";
import {DataProvider} from "../../providers/data/data";
import * as moment from 'moment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { HttpClientModule} from "@angular/common/http";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {

  @ViewChild('deviceSelect') deviceSelect: Select; //Reference i objekta html

  public chartSelect: string;

  chartName: string = '';
  typeSelect:string = '';
  deviceType:string = '';
  chartComment: string = '';
  chartNo:number = undefined;
  chartObj:any = undefined;
  selectedDevice:any = [];
  availableDevice:any = [];
  to:any = moment().valueOf();
  valUrl:string = 'https://portal.iamus.net:7777';
  allAvailableSelected:boolean = false;
  allSelectedSelected:boolean = true;
  deviceSegment:string = 'available';

  deviceList:any = [
    // {devNo: 1, devName: 'devA', devType: 'Temperature', devCom: "asrryd",boolean:false},
    // {devNo: 2, devName: 'devB', devType: 'Humidity', devCom: "asdfgh,m",boolean:false},
    // {devNo: 3, devName: 'devC', devType: 'Wind Speed', devCom: "asrktykd",boolean:false},
    // {devNo: 4, devName: 'devD', devType: 'Temperature', devCom: "asfghjd",boolean:false},
    // {devNo: 5, devName: 'devE', devType: 'Humidity', devCom: "asbvn.d",boolean:false},
    // {devNo: 6, devName: 'devF', devType: 'Wind Speed', devCom: "asfghkd",boolean:false},
    // {devNo: 7, devName: 'devG', devType: 'Temperature', devCom: "asfghkyd",boolean:false},
    // {devNo: 8, devName: 'devH', devType: 'Humidity', devCom: "askdghd",boolean:false},
    // {devNo: 9, devName: 'devI', devType: 'Wind Speed', devCom: "assred",boolean:false},
  ];

  constructor(
    public http: HttpClient,
    private data: DataProvider,
    private modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
  ) {
    this.chartNo = this.navParams.get('chartNo');
    this.chartObj = this.navParams.get('chartObj');
    this.applyValues();
    // this.availableDeviceFill();
    this.getSensorList();
  }

  getSensorList(){
    this.data.getSensorList().subscribe((data)=>{
      this.availableDevice = data;
      this.selectedDeviceFilter();
    });
  }


  selectedDeviceFilter(){
    if(this.selectedDevice.length > 0){
      for(let i = 0; i < this.availableDevice.length; i++){
        for(let j = 0; j < this.selectedDevice.length; j++){
          if(this.selectedDevice[j].name == this.availableDevice[i].name && this.selectedDevice[j].tenant == this.availableDevice[i].tenant){
            this.availableDevice.splice(i,1);
          }
        }
      }
    }
  }

  ionViewDidLoad(){
  }

  removeDevice(i){
    this.deviceList.splice(i,1);
  }


  applyValues(){
    if(this.chartObj){
      this.chartName = this.chartObj.chartName;
      this.typeSelect = this.chartObj.chartType;
      this.chartComment = this.chartObj.chartCom;
      this.chartNo = this.chartObj.chartNo;
      if(this.chartObj.chartDevice !== undefined){
        this.selectedDevice = this.chartObj.chartDevice;
        console.log(this.chartObj.chartDevice);
      }
    }
  }


  saveChart(){
    let chartObj = {
      chartNo:this.chartNo,
      chartName:this.chartName,
      chartType:this.typeSelect,
      chartCom:this.chartComment,
      chartDevice:this.selectedDevice,
    };
      this.view.dismiss(chartObj);
    };



  closeModal(){
    this.view.dismiss();
  }

  checkSelected(){
    if(this.allSelectedSelected == true)
      for(let i = 0; i < this.selectedDevice.length; i++) {
        this.selectedDevice[i].boolean = true;
      }
    else{
      for(let i = 0; i < this.selectedDevice.length; i++) {
        this.selectedDevice[i].boolean = false;
      }}}

  checkAvailable(){
    if(this.allAvailableSelected == true)
    for(let i = 0; i < this.availableDevice.length; i++) {
            this.availableDevice[i].boolean = true;
    }
    else{
      for(let i = 0; i < this.availableDevice.length; i++) {
        this.availableDevice[i].boolean = false;
      }}}


  pushToSelected(){
    for(let i = 0; i < this.availableDevice.length; i++){
      if(this.availableDevice[i].boolean == true){
        this.selectedDevice.push(this.availableDevice[i]);
        this.availableDevice.splice(i,1);
        i = i-1;
      }
    }
  }

  pushToAvailable(){
    for(let i = 0; i < this.selectedDevice.length; i++){
      if(this.selectedDevice[i].boolean == true){
        this.availableDevice.push(this.selectedDevice[i]);
        this.selectedDevice.splice(i,1);
        i = i-1;
      }
    }
  }


}
