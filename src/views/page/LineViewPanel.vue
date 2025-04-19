<!--
  图表查询
-->
<template>
  <div>
    <div>
      <div style="text-align: left">
        <el-input
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 10}"
            @change="stockListChange"
            placeholder="请输入内容"
            v-model="textContent">
        </el-input>
      </div>
      <div style="height: 600px;width: 100%">
        <LineChart :data="this.data"/>
      </div>
    </div>

  </div>
</template>

<script>

import {bigThan, queryDayLine, stockSelect} from "@/request/stock";
import FavoriteSpan from "@/views/components/FavoriteSpan";
import moment from "moment";
import StockImg from "@/views/components/StockImg";
import StockKLine from "@/views/components/StockKLine";
import LineChart from "@/views/components/LineChart";

export default {
  name: 'StockViewPanel',
  components:{
    LineChart,
    StockKLine,
    StockImg,
    FavoriteSpan
  },
  data() {
    return {
      data:null,
      textContent:null
    }
  },
  mounted() {

  },
  created() {

  },
  methods: {
    stockListChange() {
      let lines = this.textContent.split("\n");
      let x = lines.map(e => e.split(/[ ,\n\r]/g)[0])
      let y = [];
      let length = lines[0].split(/[ ,\n\r]/g).length;
      for (let i = 1;i< length;i++){
        y.push(lines.map(e => e.split(/[ ,\n\r]/g)[i]))
      }
      this.data = {x: x, y: y}
      console.log(this.data)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/styles/varibles.styl';
@import '~@/assets/styles/mixins.styl';

</style>
