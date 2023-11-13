<template>
    <div class="ai-report-entrance-info" >
        <a v-if="item.shortId>0" style="color: #8ce7ff;cursor: pointer;" :href="'https://live.douyin.com/'+item.shortId" target="_blank">
          <img :src="item.avatar" width="40" height="40" style="border-radius: 50%">
          {{item.nickName}} <span style="color: white"> 来了</span>
        </a>
        <a v-else style="color: #8ce7ff;" >
          {{item.nickName}} 来了
        </a>
    </div>
</template>
<script>
export default {
  name: "ai-report-entrance",
  props:{
    item:Object,
  },
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
        if (this.items.length >= this.maxLength) {
          this.items.shift();
        }
        this.items.push(data);
        this.toBottom()
    },
    toBottom() {
      this.$nextTick(() => {
        const entrance = this.$refs.entrance;
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
.ai-report-entrance{

}
</style>
