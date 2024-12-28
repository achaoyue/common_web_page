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
          <div class="tab_item">涨幅</div>
          <div class="tab_item">收盘价</div>
        </template>
      </div>
      <div v-for="item of data" :key="item.stockNum">
        <div class="tab_item">
          <DetailLink :stock-num="item.stockNum">{{ item.stockName }}</DetailLink>
        </div>
        <div class="tab_item">{{ item.stockNum }}</div>
        <template v-for="i of item.dayInfoDOS">
          <div class="tab_item">{{ i.upDownRange }}</div>
          <div class="tab_item">{{ i.close }}</div>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import {getDayPeriodList} from "@/request/stock";
import moment from "moment";
import DetailLink from "@/views/components/DetailLink";
import globalFunction from "@/globalFunction";
export default {
  name: "PerMonitor",
  components: {DetailLink},
  data:function (){
    return {
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