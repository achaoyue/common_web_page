<template>
  <div>
    <div>
      <el-date-picker
          v-model="param.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期">
      </el-date-picker>
      <el-date-picker
          v-model="param.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期">
      </el-date-picker>
      <el-button @click="queryList">查询</el-button>
    </div>
<!--    <div>-->
<!--        <div class="item_row" v-for="(value,key) in this.data" :key="key">-->
<!--          <div class="item_col" style="width: 100px">{{key}}</div>-->
<!--          <div class="item_col" :style="{backgroundColor:value.indexOf(day)>=0?'#f11ef1':'#aabbcc'}" v-for="day of days" :key="key+'-'+day"></div>-->
<!--        </div>-->
<!--    </div>-->
    <div>
      <div class="item_row" v-for="item of resultStockUpDay" :key="item.k">
        <div class="item_col" style="width: 150px">
          <StockDetailPop
              :key="item.k+'_detail_pop'"
              :stock-num="calcStockNum(item.k)"
              :default-start-date="param.startDate"
              :default-end-date="param.endDate" >
            {{item.k}}
          </StockDetailPop>

        </div>
        <div class="item_col"
             @click="showDay(item,idx)"
             :style="{backgroundColor:day=='1'?'#f11ef1':'#aabbcc'}" v-for="(day,idx) in item.v"
             :key="idx"></div>
      </div>
    </div>

  </div>
</template>

<script>
import {upTopList} from "@/request/stock";
import moment from "moment";
import StockDetailPop from "@/views/components/StockDetailPop";

export default {
  name: "UpTopTable",
  components: {StockDetailPop},
  data:function (){
    return {
      resultStockUpDay:{},
      days:[],
      data:{},
      param:{
        startDate:moment().subtract(30,'days').format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD")
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods:{
    calcStockNum(str){
      return str.split("-")[1];
    },
    showDay(item,idx){
      this.$message(item.day[idx]);
    },
    queryList(){
      upTopList(this.param).then(resp=>{
        let data = resp.data;
        let daysmap = {};
        for (let item of data) {
          daysmap[item.value] = 1;
        }


        //股票涨停日期map
        let stockUpMap = {};
        for (let item of data) {
          if (stockUpMap[item.key]==null){
            stockUpMap[item.key] = [];
          }
          stockUpMap[item.key].push(item.value);
        }

        //股票每日是否涨停
        let stockUpDayMap = {};
        let stockUpDayStrMap = {};
        let i = this.param.endDate;
        for(;i>=this.param.startDate;i = moment(i).subtract(1,'days').format("YYYY-MM-DD")){

          if (!daysmap[i]){
            continue;
          }
          for (let key in stockUpMap){
            if (stockUpDayMap[key] == null){
              stockUpDayMap[key] = "";
            }
            if (stockUpMap[key].indexOf(i)<0){
              stockUpDayMap[key]+="0";
            }else {
              stockUpDayMap[key]+="1";
            }
            if (stockUpDayStrMap[key]==null){
              stockUpDayStrMap[key] = [];
            }
            stockUpDayStrMap[key].push(i)
          }
        }

        //股票涨停排序
        let stockNames = Object.keys(stockUpDayMap).sort((key1,key2)=>{
          return stockUpDayMap[key2].localeCompare(stockUpDayMap[key1]);
        })

        let resultStockUpDay = stockNames.map(e=>{
          return {
            k:e,
            v:stockUpDayMap[e].split(''),
            day:stockUpDayStrMap[e]
          }
        })

        this.resultStockUpDay = resultStockUpDay;
        console.log(this.resultStockUpDay)
      })
    }
  }
}
</script>

<style scoped>
.item_col{
  margin: 0;
  padding: 0;
  width: 20px;
  height: 20px;
  border-right: solid black 1px;
  display: inline-block;
}
.item_row{
  margin: 0;
  padding: 0;
}
</style>