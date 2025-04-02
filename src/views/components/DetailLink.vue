<template>
  <span>
    <a v-if="!$slots.default" target="_blank" :href="getStockNum2()">财富网</a>
    <a v-if="$slots.default" target="_blank" :href="getStockNum2()">
      <slot></slot>
    </a>
  </span>
</template>

<script>
export default {
  name: "DetailLink",
  props:{
    stockNum: String
  },
  methods:{
    getStockNum2() {
      if (this.stockNum.startsWith("BK")){
        return 'https://quote.eastmoney.com/bk/90.'+this.stockNum+'.html'
      } else if (this.stockNum.startsWith("6")) {
        return  'http://quote.eastmoney.com/concept/'+"sh" + this.stockNum+'.html#';
      } else {
        return  'http://quote.eastmoney.com/concept/'+"sz" + this.stockNum+'.html#';
      }
    },
  }
}
</script>

<style scoped>

</style>