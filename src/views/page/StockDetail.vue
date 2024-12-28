<template>
  <div>
    test stock detail page
  </div>
</template>
<script>
export default {
  data(){
    return {
      param:{
        stockNums:["600408"],
        startDate:new Date("2024-05-01"),
        endDate:new Date(),
      }
    }
  },
  mounted() {

  },
  components:{

  },
  methods:{
    log(x){
    },
    doQuery(){
      let _this = this;
      this.param.stockNums.forEach(e=>{
        _this.$refs['child'+e][0].initK();
      })

    }
  }
}
</script>

<style scoped>


</style>