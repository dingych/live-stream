<template>
  <div class="live">
    <search ref="search" @search="searchLive"></search>
    <div class="live-content">
        <stream-douyin ref="stream"></stream-douyin>
        <barrage-douyin ref="barrage"></barrage-douyin>
    </div>
    <live-footer></live-footer>
  </div>

</template>

<script>
import StreamDouyin from "@/components/live/stream/dy/stream-douyin";
import BarrageDouyin from "@/components/live/barrage/barrage-douyin";
import Search from "@/components/common/search";
import LiveFooter from "@/components/common/live-footer";
export default {
name: "index",
  components: {LiveFooter, Search, BarrageDouyin, StreamDouyin},
  data(){
  return{

  }
  },
  methods:{
    searchLive(url,value){
      this.$refs.barrage.initWebSocket(url);
      if(value===0){
        this.$refs.stream.initFlv(0)
      }else{
        this.$refs.stream.initFlv(1)
      }

    }
  },
  mounted() {

  }

}
</script>

<style scoped>
.live{
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  align-items: center;
  color: white;
  padding-top: 8vh
}
.live-content{
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-top: 16px
}
</style>