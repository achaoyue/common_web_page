<!-- 历史清空股票 -->
<template>
  <div style="">
    <span v-for="item of data" style="width: 30%; display: inline-block">
      <span>{{item.stockName}}</span>
      <StockKLine :with-zoom="false" :stock-num="item.stockNum" :start-date="'2023-06-01'" :end-date="new Date()"/>
    </span>
  </div>
</template>

<script>
import StockKLine from "@/views/components/StockKLine";
export default {
  name: "HistorySold",
  components: {StockKLine},
  data(){
    return {
      data : [
        {"stockName":"天顺风能  ","stockNum":"002531"},
        {"stockName":"江苏新能  ","stockNum":"603693"},
        {"stockName":"骆驼股份  ","stockNum":"601311"},
        {"stockName":"新华百货  ","stockNum":"600785"},
        {"stockName":"畅联股份  ","stockNum":"603648"},
        {"stockName":"南方精工  ","stockNum":"002553"},
        {"stockName":"天成自控  ","stockNum":"603085"},
        {"stockName":"大为股份  ","stockNum":"002213"},
        {"stockName":"海信家电  ","stockNum":"000921"},
        {"stockName":"美的集团  ","stockNum":"000333"},
        {"stockName":"吉翔股份  ","stockNum":"603399"},
        {"stockName":"仁和药业  ","stockNum":"000650"},
        {"stockName":"金陵药业  ","stockNum":"000919"},
        {"stockName":"高乐股份  ","stockNum":"002348"},
        {"stockName":"富森美 ","stockNum":"002818"},
        {"stockName":"飞马国际  ","stockNum":"002210"},
        {"stockName":"昂利康 ","stockNum":"002940"},
        {"stockName":"清源股份  ","stockNum":"603628"},
        {"stockName":"金固股份  ","stockNum":"002488"},
        {"stockName":"世龙实业  ","stockNum":"002748"},
        {"stockName":"广信股份  ","stockNum":"603599"},
        {"stockName":"民和股份  ","stockNum":"002234"},
        {"stockName":"中公教育  ","stockNum":"002607"},
        {"stockName":"上海医药  ","stockNum":"601607"},
        {"stockName":"华神科技  ","stockNum":"000790"},
        {"stockName":"生 意 宝 ","stockNum":"002095"},
        {"stockName":"精华制药  ","stockNum":"002349"},
        {"stockName":"晋控煤业  ","stockNum":"601001"},
        {"stockName":"日久光电  ","stockNum":"003015"},
        {"stockName":"中国神华  ","stockNum":"601088"},
        {"stockName":"中色股份  ","stockNum":"000758"},
        {"stockName":"爱旭股份  ","stockNum":"600732"},
        {"stockName":"宏创控股  ","stockNum":"002379"},
        {"stockName":"恒久科技  ","stockNum":"002808"},
        {"stockName":"用友网络  ","stockNum":"600588"},
        {"stockName":"远东传动  ","stockNum":"002406"},
        {"stockName":"卓翼科技  ","stockNum":"002369"},
        {"stockName":"凯撒文化  ","stockNum":"002425"},
        {"stockName":"三孚股份  ","stockNum":"603938"},
        {"stockName":"兖矿能源  ","stockNum":"600188"},
        {"stockName":"天马股份  ","stockNum":"002122"},
        {"stockName":"大参林 ","stockNum":"603233"},
        {"stockName":"中国中车  ","stockNum":"601766"},
        {"stockName":"长江健康  ","stockNum":"002435"},
        {"stockName":"浙江建投  ","stockNum":"002761"},
        {"stockName":"豪尔赛 ","stockNum":"002963"},
        {"stockName":"中国人寿  ","stockNum":"601628"},
        {"stockName":"隆基绿能  ","stockNum":"601012"},
        {"stockName":"徐工机械  ","stockNum":"000425"},
        {"stockName":"三江购物  ","stockNum":"601116"},
        {"stockName":"圣农发展  ","stockNum":"002299"},
        {"stockName":"力鼎光电  ","stockNum":"605118"},
        {"stockName":"华电能源  ","stockNum":"600726"},
        {"stockName":"联络互动  ","stockNum":"002280"},
        {"stockName":"巨人网络  ","stockNum":"002558"},
        {"stockName":"天下秀 ","stockNum":"600556"},
        {"stockName":"安图生物  ","stockNum":"603658"},
        {"stockName":"正裕工业  ","stockNum":"603089"},
        {"stockName":"双成药业  ","stockNum":"002693"}
      ]
    }
  }
}
</script>

<style scoped>

</style>