<template>
  <div class="ai-report-gift" >
      <a v-if="item.shortId>0" style="color: #8ce7ff;cursor: pointer" :href="'https://live.douyin.com/'+item.shortId" target="_blank">
        <img :src="item.avatar" width="40" height="40" style="border-radius: 50%">
      </a>
      <a v-else style="color: #8ce7ff;" >{{item.nickName}}:</a>
      <span>{{item.describe}}</span>
      <img :src="'http://p6-webcast.douyinpic.com/img/'+item.imgUrl+'~tplv-obj.image'" width="50" height="50">
      <span>x {{item.giftCount}}</span>
  </div>
</template>
<script>
export default {
  props:{
    item:Object,
  },
  name: "ai-report-gift",
  data(){
    return{
      items: [],
      maxLength: 100,
    }
  },
  mounted() {

  },
  methods:{
    enq(data) {
      data.imgUrl = "http://p6-webcast.douyinpic.com/img/"+data.imgUrl+"~tplv-obj.image"
        if (this.items.length >= this.maxLength) {
          this.items.shift();
        }
        this.items.push(data);
        this.toBottom()
    },
    toBottom() {
      this.$nextTick(() => {
        const gift = this.$refs.gift;
        gift[gift.length-1].scrollIntoView({
          block:"start",
          behavior:"smooth"
        })
      });
    },
  }
}
</script>

<style scoped>
</style>
