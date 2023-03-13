<template>
  <div v-if="stockNum != '' && keyPressed != 'a' " class="pop-span">
    <div style="text-align: center;width: 100%;background-color: #6f42c1" @click="closePanel()">close</div>
    <img :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&token=44c9d251add88e27b65ed86506f6e5da&nid='+selectStockNum+'&timespan=1672321137'"/>
    <img :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=t&type=M4&token=44c9d251add88e27b65ed86506f6e5da&nid='+selectStockNum+'&timespan=1672584931'"/>
    <img :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+selectStockNum+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
    <img :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+selectStockNum+'&type=W&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=1672663437'"/>
    <img :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+selectStockNum+'&type=M&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=1672663478'"/>
    <div>

    </div>
  </div>
</template>

<script>
import {getDayInfoList} from "@/request/stock";
import moment from "moment";

export default {
  name: "StockPop",
  props:{
    stockNum:String,
    type:String
  },
  data(){
    return {
      keyPressed:'',
      stockDayInfoMap:{},
      stockDayInfo:{}
    }
  },
  mounted() {
    document.onkeydown = (event)=>{
      if (event.key == 'a'){
        if (this.keyPressed == 'a'){
          this.keyPressed = '';
        }else {
          this.keyPressed = 'a';
        }
      }
    }
  },
  watch:{
    // stockNum (oldVal,newVal){
    //   if (!newVal){
    //     return;
    //   }
    //   let now = new Date();
    //   let thirtyDayAgo = new Date(now.getTime() - 100*1000*60*60*24);
    //   let stock = this.stockDayInfoMap[newVal]
    //   if (stock == null) {
    //     let param = {
    //       stockNums:[newVal],
    //       endTime:moment(now).format("YYYY-MM-DD"),
    //       startTime:moment(thirtyDayAgo).format("YYYY-MM-DD")
    //     }
    //     getDayInfoList(param).then((resp)=>{
    //
    //         this.stockDayInfoMap = Object.assign(this.stockDayInfoMap,resp.data);
    //         this.stockDayInfo = this.stockDayInfoMap[newVal];
    //     })
    //   }else{
    //     this.stockDayInfo = this.stockDayInfoMap[newVal];
    //   }
    // },
    stockDayInfo(){

    }
  },
  computed:{
    selectStockNum(){
      if (this.stockNum.startsWith("6")){
        return "1."+this.stockNum;
      }else if (this.stockNum.startsWith("3")){
        return "0."+this.stockNum;
      }else if (this.stockNum.startsWith("0")){
        return "0."+this.stockNum;
      }else {
        return "0."+this.stockNum;
      }
    }
  },
  methods:{
    closePanel(){
      this.keyPressed = "a"
    }
  }
}
</script>

<style scoped>
.pop-span{
  position: fixed;
  top: 20px;
  right: 30px;
  height: 10px;
  background-color: #6f42c1;
  max-width: 300px;
}
.pop-span img{
  width: 100%;
}
</style>