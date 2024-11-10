<template>
  <span>
    <a v-if="!$slots.default" target="_blank" :href="'http://quote.eastmoney.com/concept/'+getStockNum2()+'.html#'">财富网</a>
    <a v-if="$slots.default" target="_blank" :href="'http://quote.eastmoney.com/concept/'+getStockNum2()+'.html#'">
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
      if (this.stockNum.startsWith("6")) {
        return "sh" + this.stockNum;
      } else {
        return "sz" + this.stockNum;
      }
    },
  }
}
</script>

<style scoped>

</style>