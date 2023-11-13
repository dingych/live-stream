<template>
  <div class="ai-report-room" >
    <div style=" display: flex;justify-content: space-between ">
      <div>
        <a style="font-family: bold;font-weight: 100;font-weight: bold" href="http://www.softworld.vip" target="_blank">AI直播</a>
      </div>
      <a :href="roomInfo.roomUrl" target="_blank">房间链接:{{roomInfo.roomUrl?roomInfo.roomUrl:'无'}}</a>
      <div>房间在线人数:{{totalInfo.count?totalInfo.count:0}}</div>
      <div>房间场光数:{{totalInfo.rankScore?totalInfo.rankScore:0}}</div>
    </div>
  </div>
</template>
<script>

import { getRoomUrl} from "@/utils/storage";
export default {
  name: "ai-report-room",
  data(){
    return{
      totalInfo: {},
      roomInfo: {},
    }
  },
  mounted() {
    this.roomInfo=getRoomUrl()
  },
  methods:{
    enq(data) {
      this.totalInfo = data;
    },
  }
}
</script>

<style scoped>
.ai-report-room{
  color: #b8c4c0;
}
</style>
