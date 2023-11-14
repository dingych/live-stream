<template>
  <div style="width: 100%;height: 6vh;background-color: rgb(66 61 61);display: flex;flex-direction: row;justify-content: flex-start;align-items: center">
    <div><img :src="roomInfo.avatar" style="border-radius: 50%;height:5vh; padding-left: 10px"></div>
    <div><span style="font-size: 10px; padding-left: 10px">{{roomInfo.nickName}}</span></div>
    <div><span style="font-size: 20px; padding-left: 10px;padding-left: 19vw">{{roomInfo.title}}</span></div>
  </div>
</template>

<script>
export default {
name: "stream-douyin-title",
  props:{
    roomInfo:Object
  }
}
</script>

<style scoped>

</style>