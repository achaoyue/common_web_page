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
      <el-button type="mini" @click="crowTime">crow</el-button>
    </div>
    <div style="height: 400px">
      <LineChart :fix-id="'DayMinuteTradePan'" :stockNum="this.stockNum" :data="this.data"/>
    </div>
  </div>
</template>
<script>
import {crowTime, getDayMinutesTrade} from "@/request/stock";
import LineChart from "@/views/components/LineChart.vue";

export default {
  name: "DayMinuteTradePan",
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
    crowTime(){
      crowTime({stockNum:this.stockNum}).then(resp=>{
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success'
        });
      })
    },
    queryFund(){
      getDayMinutesTrade(this.param).then(resp=>{
        let data = {};
        data.x = resp.data.map(e=>e.key);
        let y = [];
        y = resp.data.map(e=>e.value);
        data.y = [y];
        console.log(data)
        this.data = data;
      })
    }
  }
}
</script>


<style scoped>

</style>