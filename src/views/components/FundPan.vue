<template>
  <div>
    <div>
      <el-date-picker
          v-model="param.startDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择开始日期">
      </el-date-picker>
      <el-date-picker
          v-model="param.endDate"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="选择结束日期">
      </el-date-picker>
      <el-button type="mini" @click="queryFund">刷新</el-button>
    </div>
    <div style="height: 400px">
      <LineChart :fix-id="'fund_span'" :stockNum="this.stockNum" :data="this.data"/>
    </div>
  </div>
</template>
<script>
import {queryFund} from "@/request/stock";
import LineChart from "@/views/components/LineChart.vue";

export default {
  name: "FundPan",
  components: {LineChart},
  props:{
    stockNum:String,
    startDate: [Date, String],
    endDate: [Date, String],
  },
  data:function (){
    return {
      data:{},
      param:{
        stockNum:this.stockNum,
        startDate:this.startDate,
        endDate:this.endDate
      }
    }
  },
  mounted() {
    this.queryFund();
  },
  methods:{
    queryFund(){
      queryFund(this.param).then(resp=>{

        let data = {};
        data.legend = ["主力", "超大单", "大单","中单","小单"]
        data.x = resp.data.map(e=>e.date)
        let y=[];
        y[0] = resp.data.map(e=>e.mainMoneyIn-e.mainMoneyOut);
        y[1] = resp.data.map(e=>e.superBigMoneyIn-e.superBigMoneyOut);
        y[2] = resp.data.map(e=>e.bigMoneyIn-e.bigMoneyOut);
        y[3] = resp.data.map(e=>e.middleMoneyIn-e.middleMoneyOut);
        y[4] = resp.data.map(e=>e.smallMoneyIn-e.smallMoneyOut);
        data.y = y;

        this.data = data;
      })
    }
  }
}
</script>


<style scoped>

</style>