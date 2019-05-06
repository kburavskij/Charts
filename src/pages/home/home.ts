import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, ModalController, Select} from 'ionic-angular';
import {Chart} from 'angular-highcharts';
import * as moment from 'moment';
import {DataProvider} from "../../providers/data/data";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {update} from "ionic-angular/umd/components/slides/swiper/swiper";
import {createOptional} from "@angular/compiler/src/core";
import {text} from "@fortawesome/fontawesome";
import {titleCase} from "@ionic/app-scripts";
import {addLabel} from "ionic-angular/umd/components/slides/swiper/swiper-a11y";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  chartList:any = undefined;
  chartObj:any = undefined;
  currentTime:any = moment().format("HH:MM:SS");
  offsetTime: any = moment(this.currentTime).subtract(1,"day");
  oneHour: any = 3600 * 1000;
  myChart:Chart = undefined;
  index:number = undefined;
  myData:any = [];
  name:any;
  unitValue:any;

  constructor(
    public http: HttpClient,
    private data: DataProvider,
    private modal: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private view: ViewController,
  ) {
    this.chartObj = this.navParams.get('chartList');
    this.index = this.navParams.get('index');
    console.log(this.chartObj);
    this.chartCreation();

    this.addDevices();

  }


  ionViewDidLoad(){
  }

  addDevices(){
    let timeFrame = undefined;
    for(let i=0; i<this.chartObj.chartDevice.length; i++){
      let tenant = this.chartObj.chartDevice[i].tenant;
      let device = this.chartObj.chartDevice[i].name;
      let unitValue:any = this.chartObj.chartDevice[i].lookupKey.unitValue;
      console.log(unitValue);
      this.data.getSensorData(timeFrame,tenant,device).subscribe((data)=>{
      this.myData = data;
        this.pushValue(this.myData,i, unitValue);
    });
    }
  }


  pushValue(myData,i, unitValue){
    let yAxis = i;
    let result = [];
    let name = undefined;
    for(let i = 0; i < myData.length; i++){
        myData[i].tstamp = moment(myData[i].tstamp).valueOf();
        let myDeviceData = [myData[i].tstamp,myData[i].dval];
        result.push(myDeviceData);
        name = myData[i].deviceType;
        this.name = name;
        this.unitValue = unitValue;
    }
    if(result.length > 0){
      this.pushChartData(result,name,yAxis,unitValue);
    }
    console.log(myData);
    console.log('this is Data');
  }

  pushChartData(result,name,yAxis,unitValue){
    this.myChart.addSerie({
      name: name,
      data: result,
      yAxis: yAxis,
    });
  }



  chartCreation(){
    this.myChart = new Chart({
      chart: {
        type: this.chartObj.chartType,
      },
      yAxis: [
        { // Primary yAxis
        title: {
          text: name,
        },
        labels: {
          format: this.unitValue,
        },
      },

        { //--- Secondary yAxis
        title: {
          text: this.name,
        },
          labels: {
            format: this.unitValue,
          },
          opposite: true
      },

        { //--- Primary
          title: {
            text: this.name,
          },
          labels: {
            format: this.unitValue,
          },
        },

        { //--- Secondary yAxis
          title: {
            text: this.name,
          },
          labels: {
            format: this.unitValue,
          },
          opposite: true
        },
        ],
      legend:{
        enabled: true
      },
      credits:{
        enabled: false
      },
      // tooltip: {
      //   formatter: function() {
      //     return this.y + '%';
      //   }
      // },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%H:%M'
        },
        tickInterval: this.oneHour,
      },
      title: {
        text: this.chartObj.chartName
      },
      // plotOptions: {
      //   series: {
      //     pointStart: 0,
      //     pointInterval: this.oneHour,
      //   }
      // },
    });
  }
  

  goToListPage(){
    this.navCtrl.push('ListPage')
  }


  editChart(){
    let editModal = this.modal.create('SettingsPage', {chartObj:this.chartObj}, { cssClass: "modal-fullscreen" }); // Iskviecia moduli
    editModal.onDidDismiss(data =>  { //Kai isjungiamas modulis - vykdo funkcija
        if(data){
        this.chartObj = data;
        console.log(data,this.chartObj);
          this.chartCreation();
      }
    });
    editModal.present(); //Iskviecia
  }


/*  goToSettingsPage(){
    this.navCtrl.push('SettingsPage',{
      chartObj : {
        chartNo:this.navParams.data.chartList.chartNo,
        chartName:this.navParams.data.chartList.chartName,
        chartType:this.navParams.data.chartList.chartType,
        chartData:this.navParams.data.chartList.chartData,
        chartCom:this.navParams.data.chartList.chartCom
      }}
    );
    console.log(this);
  }*/

  closeModal(){
    this.view.dismiss();
  }

  closeHome(){
    this.navCtrl.pop().then(() => {
      this.navParams.get('callback')(this.chartObj);
    });
  }

}
