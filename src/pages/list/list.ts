import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController, Select} from 'ionic-angular';
import {SettingsPage} from "../settings/settings";
import { HomePage } from "../home/home";
import {Chart} from "angular-highcharts";
import * as moment from 'moment';
import {indexForItem} from "ionic-angular/umd/components/item/item-reorder-util";
import { NgModule} from '@angular/core';
import { MenuController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html',
})


export class ListPage {

  startTime: any = moment().valueOf();
  offsetTime: any = moment(this.startTime).add(2, 'hours');
  myData: any = [6 ,1,0 , 2, 3, 4, 5,6 ,1,0 , 2, 3, 4, 5,6 ,1,0 , 2, 3, 4, 5];
  chartNo:number = undefined;
  deviceObj:any = undefined;
  chartObj:any;
  index:number = undefined;
  selectedDevice:any = [];


  chartList:any = [
    {chartNo: 1, chartName: 'Pie Chart', chartType: 'pie', chartCom: "asdasdaasdsd", chartData: undefined, chartDevice: undefined},
    {chartNo: 2, chartName: 'Line Chart', chartType: 'line', chartCom: "asdasdasdasd", chartData: undefined, chartDevice: undefined},
    {chartNo: 3, chartName: 'Column Chart', chartType: 'column', chartCom: "asdasdasdasd", chartData: undefined, chartDevice: undefined},
  ];

  constructor(
    public navCtrl: NavController,
    private modal: ModalController,
    private view: ViewController,
    public menuCtrl: MenuController,
    public navParams: NavParams
  ) {
    this.deviceObj = this.navParams.get('deviceObj');
    this.chartNo = this.chartList.length + 1;
  }


  createNewChart(i){
    let settingsModal = this.modal.create('SettingsPage', {chartNo:this.chartNo, chartObj:this.chartList[i]}, { cssClass: "modal-fullscreen" });
    settingsModal.onDidDismiss(data =>  {
      if(data && data.chartName && data.chartName != "" && data.chartType && data.chartType !== ""){
        this.chartNo++;
        this.chartObj = data;
        console.log(data);
        this.chartList.push(data);
      }
    });
      settingsModal.present();
  }

  editChart(i){
    let editModal = this.modal.create('SettingsPage', {chartObj:this.chartList[i]}, { cssClass: "modal-fullscreen" });
    editModal.onDidDismiss(data =>  {
      if(data){
        this.chartList[i] = data;
        this.chartObj = data;
        console.log(this.chartList);
      }
    });
    editModal.present();
  }

  removeChart(i){
    this.chartList.splice(i,1);
  }

  callback:any = data => {
    console.log(data);
    if(data){
      this.chartObj = data;
      this.chartList[this.index] = this.chartObj;
    }
  };

  goToHomePage(i){
    this.index = i;
    this.navCtrl.push(HomePage, {chartList:this.chartList[i], callback: this.callback} );
    console.log(this.chartList)
  }

}
