<template>
  <div v-if="stockNum != '' && keyPressed != 'a' " class="pop-span">
    <img :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=r&type=&token=44c9d251add88e27b65ed86506f6e5da&nid='+selectStockNum+'&timespan=1672321137'"/>
    <img :src="'https://webquotepic.eastmoney.com/GetPic.aspx?imageType=t&type=M4&token=44c9d251add88e27b65ed86506f6e5da&nid='+selectStockNum+'&timespan=1672584931'"/>
    <img :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+selectStockNum+'&UnitWidth=-6&imageType=KXL&EF=&Formula='+(type)+'&AT=0&&type=&token=44c9d251add88e27b65ed86506f6e5da&wbp2u=|0|0|0|web&_=0.07544766952719373'"/>
    <img :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+selectStockNum+'&type=W&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=1672663437'"/>
    <img :src="'http://webquoteklinepic.eastmoney.com/GetPic.aspx?nid='+selectStockNum+'&type=M&unitWidth=-6&ef=&formula=RSI&AT=1&imageType=KXL&timespan=1672663478'"/>
  </div>
</template>

<script>
export default {
  name: "StockPop",
  props:{
    stockNum:String,
    type:String
  },
  data(){
    return {
      keyPressed:''
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
    stockNum (oldVal,newVal){
      console.log(oldVal,newVal)
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