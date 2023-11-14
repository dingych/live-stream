<template>
  <div style="width: 300px;height: 70vh;font-size:13px;background-color:  rgb(66 61 61);margin-left: 5px;border-radius: 5px;align-items: center">
    <span style="display: flex;justify-content: center;align-items: center;height: 40px;font-size: 12px">在线观众:{{roomInfo.count}}</span>
    <div class="content-info">
      <div v-for="(item,index) in items" :key="index"  ref="msg" style="overflow-y: hidden">
        <span v-if="item.type===0">
            <ai-report-entrance :item="item"></ai-report-entrance>
        </span>
        <span v-else-if="item.type===1">
            <ai-report-comment :item="item"></ai-report-comment>
        </span>
        <span v-else-if="item.type===2">
            <ai-report-gift :item="item"></ai-report-gift>
        </span>
        <span v-else-if="item.type===3">
            <ai-report-nice :item="item" ></ai-report-nice>
        </span>
        <span v-else-if="item.type===5">
            <ai-report-focus :item="item"></ai-report-focus>
        </span>
      </div>


    </div>
  </div>
</template>

<script>
import config from "@/config/config";
import protobuf from "@/proto/proto";
import pako from "pako";
import AiReportEntrance from "@/components/report/ai-report-entrance";
import AiReportGift from "@/components/report/ai-report-gift";
import AiReportComment from "@/components/report/ai-report-comment";
import AiReportNice from "@/components/report/ai-report-nice";
import AiReportFocus from "@/components/report/ai-report-focus";
import {getRoomUrl} from "@/utils/storage";

export default {
name: "barrage-douyin",
  components: {AiReportFocus, AiReportNice, AiReportComment, AiReportGift, AiReportEntrance},
  data(){
    return{
      items: [],
      maxLength: 300,
      websocket: null,
      openHeart:null,
      closeHeart:null,
      roomUrl:null,
      isInitClose:false,
      roomInfo:{
        count:"",
        totalUser:"",
        msgId:"",
        rankScore:"",
        roomId:"",
      }
    }
  },
  methods:{

    initWebSocket(wsUrl) {
      if(this.websocket!=null&&this.websocket.isActive){
        this.websocket.close();
        this.isInitClose=true;
      }
      this.roomUrl = wsUrl.roomUrl
      this.websocket = new WebSocket(wsUrl.wssUrl);
      this.websocket.binaryType = config.wsBinaryType;
      this.websocket.onmessage = this.webSocketMessage;
      this.websocket.onopen = this.webSocketOpen;
      this.websocket.onerror = this.webSocketError;
      this.websocket.onclose = this.webSocketClose;
    },

    webSocketOpen: function () {
      console.log("---------------WebSocket连接成功--------------")
      this.socketSendHeart();
      if(this.closeHeart){
        clearTimeout(this.closeHeart);
      }
    },

    webSocketError() {

    },
    webSocketMessage: function (event) {
      let barrage = protobuf.lookup("framework.PushFrame");
      const barrageDecode = barrage.decode(new Uint8Array(event.data))
      const  decompressed = pako.ungzip(barrageDecode.payload)
      const  response = protobuf.lookup("framework.Response");
      var message = response.decode(new Uint8Array(decompressed));
      var res = response.toObject(message,{});
      if(res.needAck){
        this.socketSendAck(decompressed.logId,'ack');
      }
      if(res.messagesList&&res.messagesList.length>0){
        for(let i = 0;i<res.messagesList.length;i++){
          this.dealMessage(res.messagesList[i]);
        }
      }
    },

    socketSendHeart  :function  () {
      let heart = {
        PayloadType:"bh"
      }
      this.dyClientSend("framework.PushFrame",heart)
    },

    socketSendAck:function(logId,internalExt) {
      let ackPack = {
        LogId:logId,
        payload_type:internalExt
      }
      this.dyClientSend("framework.PushFrame",ackPack)
    },
    dyClientSend: function (lookupType, barrageData) {
      let baseLookupType = protobuf.lookup(lookupType);
      let data = baseLookupType.create(barrageData);
      let sendData = baseLookupType.encode(data).finish();
      this.webSocketSend(sendData);
    },
    //处理消息
    dealMessage(Message){
      switch (Message.method) {
        case "WebcastChatMessage":
          //处理评论消息
          var chatMessage = protobuf.lookup("framework.ChatMessage");
          var res
          try{
            res = chatMessage.decode(new Uint8Array(Message.payload));
          }catch (e) {
            // console.log("发送异常")
          }
          if(res){
            var chatMsg = {
              type:1,
              shortId:  res.user.shortId,
              content:  res.content,
              nickName: res.user.nickName,
              gender:   res.user.gender,
              msgId:    res.common.msgId,
              avatar:   res.user.AvatarThumb.urlListList[0],
            }
            this.enq(chatMsg)

          }
          break
        case "WebcastGiftMessage":
          var giftMessage = protobuf.lookup("framework.GiftMessage");
          var giftD = giftMessage.decode(new Uint8Array(Message.payload));
          if(giftD) {
            var giftMsg = {
              type:2,
              shortId: giftD.user.shortId,
              content: giftD.gift.name,
              nickName: giftD.user.nickName,
              gender: giftD.user.gender,
              msgId: giftD.common.msgId,
              giftCount: giftD.totalCount,
              avatar: giftD.user.AvatarThumb.urlListList[0],
              describe:  giftD.gift.describe,
              imgUrl:giftD.gift.image.uri,
            }
            this.enq(giftMsg)
          }
          break
        case "WebcastLikeMessage":
          var likeMessage = protobuf.lookup("framework.LikeMessage");
          var like = likeMessage.decode(new Uint8Array(Message.payload));
          if(like) {
            var likeMsg = {
              type:3,
              shortId: like.user.shortId,
              content: "点赞",
              nickName: like.user.nickName,
              gender: like.user.gender,
              msgId: like.common.msgId,
              count: like.count,
              avatar: like.user.AvatarThumb.urlListList[0],
            }
            this.enq(likeMsg)
          }
          break
        case "WebcastMemberMessage":
          var memberMessage = protobuf.lookup("framework.MemberMessage");
          var member = memberMessage.decode(new Uint8Array(Message.payload));
          if(member){
            var memberMsg = {
              type:0,
              shortId:  member.user.shortId,
              content:  "入场",
              nickName: member.user.nickName,
              gender:   member.user.gender,
              msgId:    member.common.msgId,
              avatar:   member.user.AvatarThumb.urlListList[0],
            }
            this.enq(memberMsg)
          }
          break
          //新光
        case "WebcastRoomUserSeqMessage": //必须订阅
          var roomUser = protobuf.lookup("framework.RoomUserSeqMessage");
          var countUser = roomUser.decode(new Uint8Array(Message.payload));
          if(countUser) {
            var countMsg = {
              count:     countUser.total,
              totalUser: countUser.totalUser,
              msgId:     countUser.common.msgId,
              rankScore: countUser.totalPvForAnchor,
              roomId:    countUser.common.roomId,
            }
            this.roomInfo=countMsg
          }
          break
        case "WebcastSocialMessage":
          var socialMessage = protobuf.lookup("framework.SocialMessage");
          var social = socialMessage.decode(new Uint8Array(Message.payload));
          if(social){
            var socialMsg = {
              type:5,
              shortId:  social.user.shortId,
              content:  "关注",
              nickName: social.user.nickName,
              msgId:    social.common.msgId,
              roomId:   social.common.roomId,
              avatar:   social.user.AvatarThumb.urlListList[0],
            }
            this.enq(socialMsg)
          }
          break
        default:
          break
      }
    },

    webSocketSend: function (Data) {
      if (this.websocket.readyState === 1) {
        this.websocket.send(Data);
      }
    },

    webSocketClose(e) {
      console.log(e)
      console.log("---------------开始进行断网重连--------------")
      if(!this.isInitClose){
        setTimeout(this.initWebSocket( getRoomUrl().wssUrl), 5000);
      }
    },

    heartBeatSend: function () {
      const data = {
        payloadType: "bh",
      }
      this.socketSendHeart("framework.PushFrame", data );
      this.openHeart = setTimeout(this.heartBeatSend, 10000);
    },
    enq(data) {
      if (this.items.length >= this.maxLength) {
        this.items.shift();
      }
      this.items.push(data);
      this.toBottom()
    },
    toBottom() {
      this.$nextTick(() => {
        const entrance = this.$refs.msg;
        entrance[entrance.length-1].scrollIntoView({
          block:"start",
          behavior:"smooth"
        })
      });
    },
  }
}
</script>

<style scoped>
.content-info{

  overflow-y: auto;
  width: 300px;
  height: 64.5vh;
}
</style>