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
    <div>
        <div class="item_row" v-for="(value,key) in this.data" :key="key">
          <div class="item_col" style="width: 100px">{{key}}</div>
          <div class="item_col" :style="{backgroundColor:value.indexOf(day)>=0?'#f11ef1':'#aabbcc'}" v-for="day of days" :key="key+'-'+day"></div>
        </div>
    </div>
  </div>
</template>

<script>
import {upTopList} from "@/request/stock";
import moment from "moment";

export default {
  name: "UpTopTable",
  data:function (){
    return {
      days:[],
      data:{},
      param:{
        startDate:moment().subtract(90,'days').format("YYYY-MM-DD"),
        endDate:moment().format("YYYY-MM-DD")
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods:{

    queryList(){
      upTopList(this.param).then(resp=>{
        let data = resp.data;
        let daysmap = {};
        let map = {};
        for (let item of data) {
          daysmap[item.value] = 1;
          let m =  map[item.key];
          if (!m) {
            m =  map[item.key] = [];
          }
          m.push(item.value)
        }
        this.days = Object.keys(daysmap).sort();
        this.data = map;
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