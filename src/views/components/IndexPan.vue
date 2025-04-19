<template>
  <div>
    <div>
      <el-date-picker
          v-model="param.startDate"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          @change="queryIndex"
          placeholder="选择日期">
      </el-date-picker>
      <el-date-picker
          v-model="param.endDate"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          @change="queryIndex"
          placeholder="选择日期">
      </el-date-picker>
      <el-button @click="queryIndex">查询</el-button>
    </div>
    <div style="height: 300px">
      <LineChart :stock-num="'dapan'" :data="lineData" ></LineChart>
    </div>
  </div>
</template>

<script>
import {queryIndex} from "@/request/stock";
import moment from "moment/moment";
import LineChart from "@/views/components/LineChart.vue";

/**
 * 指数大盘
 */

export default {
  components: {LineChart},

  data:function (){
    return {
      lineData:{

      },
      param:{
        startDate:moment().subtract(90,'days').format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD")
      }
    }
  },
  mounted() {
    this.queryIndex();
  },
  methods:{
    queryIndex:function (){
      queryIndex(this.param).then(resp=>{
        let data = resp.data;
        let days = [];
        let dayValue = [];
        let currentV = 100;
        for(let item of data){
          days.push(item.key);
          currentV = currentV*(1+item.value/100)
          dayValue.push(currentV);
        }
        console.log(dayValue)
        this.lineData = {
          x:days,
          y:[dayValue]
        }
      })
    }
  }
}
</script>

<style>

</style>