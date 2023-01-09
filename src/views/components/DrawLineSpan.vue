<template>
  <div class="k_line_span">
    <canvas width="1000px" height="1000px" id="k_line" style="width: 100%;height: 100%"/>
  </div>
</template>

<script>
export default {
  name: "DrawLineSpan",
  props:{

  },
  data(){
    return {
        canvas:null,
        context:null,
    }
  },
  mounted() {
    this.canvas = document.getElementById("k_line")
    this.context = this.canvas.getContext("2d");
    this.drawLine(0,0,200,100)

    let points = [];
    points.push(new Points(0,0));
    points.push(new Points(20,50));
    points.push(new Points(20,70));
    points.push(new Points(80,70));
    points.push(new Points(800,300));
    this.drawLines(points)
  },
  computed:{

  },
  watch:{

  },
  methods:{

    drawLines(points){
      if (!(points instanceof Array)){
        console.log("非数组，忽略处理 ",points)
        return ;
      }
      this.context.beginPath();
      this.context.moveTo(points[0].x,points[0].y);
      for (let i = 0; i < points.length; i++) {
        this.context.lineTo(points[i].x,points[i].y);
      }
      this.context.stroke();
    },

    drawLine(startX,startY,endX,endY){
      this.context.beginPath();
      this.context.moveTo(startX,startY);
      this.context.lineTo(endX,endY);
      this.context.stroke();
    }
  }
}
function Points(x,y){
  this.x = x;
  this.y = y;
}
</script>

<style scoped>
.k_line_span{
  max-width: 200px;
  background-color: #66b1ff;
}
</style>