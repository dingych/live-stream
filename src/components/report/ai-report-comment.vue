<template>
  <div class="ai-report-comment" >
        <a v-if="item.shortId>0" style="color: #8ce7ff;cursor: pointer" :href="'https://live.douyin.com/'+item.shortId" target="_blank">
          <img :src="item.avatar" width="40" height="40" style="border-radius: 50%">
          {{item.nickName}}
        </a>
        <a v-else style="color: #8ce7ff;" >{{item.nickName}}:</a>
        <span style="font-size: 15px;color: white;width: 38vh">评论:{{item.content}}</span>
  </div>
</template>
<script>
export default {
  name: "ai-report-comment",
  props:{
    item:Object
  },
  data(){
    return{
      items: [],
      maxLength: 500,
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
        const comment = this.$refs.comment;
        comment[comment.length-1].scrollIntoView({
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
