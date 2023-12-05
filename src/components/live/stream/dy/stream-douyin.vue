<template>
  <div>
    <stream-douyin-title :roomInfo="roomInfo"></stream-douyin-title>
    <div  :style="roomStyle">
      <stream-douyin-flv ref="flv"></stream-douyin-flv>
    </div>
    <div style="width: 100%;height: 8vh;background-color:rgb(46 52 44);border-bottom-right-radius: 10px;border-bottom-left-radius: 10px"></div>
  </div>

</template>

<script>
import {getRoomInfo, getRoomUrl, setRoomInfo} from "@/utils/storage";
import {getFlvUrl} from "@/api/streamUrl";
import StreamDouyinFlv from "@/components/live/stream/dy/stream-douyin-flv";
import StreamDouyinTitle from "@/components/live/stream/dy/stream-douyin-title";
export default {
name: "stream-douyin",
  components: {StreamDouyinTitle, StreamDouyinFlv},
  data(){
  return{
    roomUrl:null,
    roomInfo:{
      flvUrl:"",
      title:"",
      nickName:"",
      avatar:"",
      cover:"",
      online:""
    },
    roomStyle:{
      width:"56vw",
      height:"56vh",
      backgroundColor: "#202628",
    }
  }
  },
  mounted() {

  },
  methods:{
    initFlv(value){
      if(value===0){
        this.roomUrl = getRoomUrl().roomUrl
        let param = {
          roomUrl:this.roomUrl
        }
        getFlvUrl(param).then((res)=>{
          if(res.data.code===0){
            this.roomInfo = res.data.data
            setRoomInfo(this.roomInfo)
            console.log("得到roomInfo:",JSON.stringify(this.roomInfo))
            this.$refs.flv.broadcast(res.data.data)

          }
        })
      }else{
        this.roomInfo = getRoomInfo()
        this.$refs.flv.broadcast(this.roomInfo)
      }

    }
  }
}
</script>

<style scoped>
</style>