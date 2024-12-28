<template>
  <div>
    <div style="margin: 20px"></div>
    <h2>股票分析</h2>
    <div style="margin: 20px"></div>
    <div style="text-align: left">
      <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 10}"
          placeholder="请输入股票代码"
          v-model="stockNums">
      </el-input>
      <div class="time_block">
        开始日期
        <el-date-picker
            v-model="this.param.startTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择开始日期">
        </el-date-picker>
      </div>
      <div class="time_block">
        结束日期
        <el-date-picker
            v-model="this.param.endTime"
            type="date"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="选择结束日期">
        </el-date-picker>
      </div>
      <el-button @click="query">查询</el-button>
    </div>
    <div style="overflow: auto;word-break: keep-all;white-space: nowrap">
      <div v-if="data != null && data.length > 0">
        <div class="tab_item" style="border: none;width: 200px"></div>
        <template v-for="i of data[0].dayInfoDOS">
          <div class="tab_item" style="width: 200px">{{ i.date }}</div>
        </template>
      </div>
      <div v-if="data != null && data.length > 0">
        <div class="tab_item" style="border: none;width: 200px"></div>
        <template v-for="i of data[0].dayInfoDOS">
          <div class="tab_item" :key="i.date+'3'">涨幅</div>
          <div class="tab_item" :key="i.date+'4'">收盘价</div>
        </template>
      </div>
      <div v-for="item of data" :key="item.stockNum">
        <div class="tab_item">
          <DetailLink :stock-num="item.stockNum">{{ item.stockName }}</DetailLink>
        </div>
        <div class="tab_item">{{ item.stockNum }}</div>
        <template v-for="i of item.dayInfoDOS">
          <div class="tab_item" :key="item.stockNum+i.date+'1'">{{ i.upDownRange }}</div>
          <div class="tab_item" :key="item.stockNum+i.date+'2'">{{ i.close }}</div>
        </template>

      </div>
    </div>
    <div>
      <h2>k线明细</h2>
      <div
          class="perfect_img"
          v-for="(item, index) in data"
          :key="index"
      >
        <div style="text-align: center">{{index}},{{item.stockName}},{{item.stockNum}}</div>
        <StockImg
            :stock-num="item.stockNum"
            :right-x="rightX"
            :ppx="ppx"
            :mouse-move-notice="mouseChange"></StockImg>
      </div>
    </div>
  </div>
</template>

<script>
import {getDayPeriodList} from "@/request/stock";
import moment from "moment";
import DetailLink from "@/views/components/DetailLink";
import globalFunction from "@/globalFunction";
import StockImg from "@/views/components/StockImg";
export default {
  name: "PerMonitor",
  components: {StockImg, DetailLink},
  data:function (){
    return {
      ppx:0,
      rightX:3,
      stockNums:globalFunction.getCookies("stockNumsText"),
      param:{
        stockNums:"",
        startTime:moment().subtract(20,'days').format("YYYY-MM-DD"),
        endTime:moment().subtract(0,'days').format("YYYY-MM-DD"),
      },
      days:[],
      data:null
    }
  },
  mounted() {
    this.query()
  },

  methods:{
    mouthMove(event){
      this.ppx = event.offsetX
    },
    mouseChange(x){
      this.ppx = x;
    },
    query(){
      if (!this.stockNums || this.stockNums == ''){
        return;
      }
      this.param.stockNums = this.stockNums.replace(/[ ,\n\r]+/g, ',')
          .split(',')
          .map(item => item.trim())
          .filter(item => item !== '');
      getDayPeriodList(this.param).then(resp=>{
        this.data = resp.data;
        globalFunction.setCookies("stockNumsText",this.stockNums);
      })
    }
  }
}
</script>

<style scoped>
.pp{
  margin-right:8px;
  float: right;
  position: absolute ;
  width: 1px;
  height: 80px;
  bottom: 130px;
  border-left: 3px solid #0000ff6b;
}
.ppx{
  height: 180px;
  bottom: 30px;
  border-left: 1px solid #0000ff6b;
}
.el-input{
  width: 100%
}
.perfect_list{
  background-color:#f9ebe8e6;
  display: block;
  text-align: center;
  padding-bottom : 10px;
}
.perfect_img{
  display :inline-block;
  max-width: 300px;
  min-width: 300px;
  border: solid 1px black;
  position: relative;
}
.perfect_img img{

}
.perfect_img  span{
  white-space: normal;
  word-break: break-all;
}
.idx_op{
  background-color: white;
}
.idx_op span{
  background-color: #f3d6d6;
  border-radius :3px;
  margin :1px 3px 0px;
  padding: 0px 3px 0px;
}
.time_block{
  display: inline-block;
  width :300px;
}
.tab_item{
  border: 1px solid black;
  display: inline-block;
  width: 100px;
  text-align: center;
}

</style>