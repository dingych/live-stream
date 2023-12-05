
<template>
  <div style="display: flex;align-items: center;">
    <a href="http://www.softworld.vip" target="_blank"><img :src="logo" width="45px"></a>
    <input v-model="roomUrl" placeholder="  请输入您的直播间链接地址" style="margin-left:10px;line-height:4vh;width:60vw;font-weight: bold; border-radius: 8px; width: 18vw"/>
    <button  style="line-height:3.8vh; border-radius: 8px;margin-left: 10px;opacity:0.8;background-color: #4ed54e;width: 3vw"
             @click="dealUrl()">查询</button>
    <button v-show="!liveLock"  style="line-height:3.8vh;border-radius: 8px;opacity:0.8;margin-left:10px;background-color: rgb(201 62 165);width: 3vw"
            @click="continueUrl()">继续</button>
<!--    <button  style="line-height:3.8vh;width: 5vw;border-radius: 8px;opacity:0.8;margin-left:10px;background-color: #b8c4c0"-->
<!--            @click="continueUrl()">采集设置</button>-->
  </div>
</template>

<script>
import logo from "@/asserts/logo.png"
import {getWssUrl} from "@/api/wssUrl";
import {getRoomUrl, setRoomUrl} from "@/utils/storage";
export default {
  name: "search",
  data(){
    return {
      logo:logo,
      roomUrl:"",
      liveLock:false
    }
  },
  methods:{
    dealUrl(){
      if (!this.roomUrl){
        alert("请输入您的直播间链接")
        return
      }
      let param = {
        roomUrl:this.roomUrl
      }
      getWssUrl(param).then((res)=>{
        if(res.data.code===0){
          let room=  {roomUrl:this.roomUrl,wssUrl:res.data.data}
          setRoomUrl(room)
          this.$emit("search",room,0)
          // this.roomUrl=""
        }else{
          alert("系统异常:"+res.data.msg)
        }
      })
    },

    continueUrl(){
      let res = getRoomUrl()
      if (res){
        this.$emit("search",res,1)
        this.liveLock=true
      }
    },
  }
}
</script>

<style scoped>

</style>