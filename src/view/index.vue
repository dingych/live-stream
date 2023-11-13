<template>
  <div class="live">
    <search ref="search" @search="searchLive"></search>
    <div class="live-content">
        <stream-douyin ref="stream"></stream-douyin>
        <barrage-douyin ref="barrage"></barrage-douyin>
    </div>
    <div style="display: flex;justify-content: center;padding-top: 50px">
      更多开源项目:<a href="https://github.com/wanyushu" target="_blank"><span style="color: #979191">https://github.com/wanyushu</span></a>
    </div>
  </div>

</template>

<script>
import StreamDouyin from "@/components/live/stream/dy/stream-douyin";
import BarrageDouyin from "@/components/live/barrage/barrage-douyin";
import Search from "@/components/common/search";
import AiReportRoom from "@/components/report/ai-report-room";
export default {
name: "index",
  components: {AiReportRoom, Search, BarrageDouyin, StreamDouyin},
  data(){
  return{

  }
  },
  methods:{
    searchLive(wssUrl){
      this.$refs.barrage.initWebSocket(wssUrl);
      this.$refs.stream.initFlv()
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