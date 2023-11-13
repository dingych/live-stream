<template>
  <div class="ai-report-nice" >
    <a v-if="item.shortId>0" style="color: #8ce7ff;cursor: pointer" :href="'https://live.douyin.com/'+item.shortId" target="_blank">
      <img :src="item.avatar" width="40" height="40" style="border-radius: 50%">
      {{item.nickName}}
    </a>
    <a v-else style="color: #8ce7ff;" >{{item.nickName}}:</a>
    <span>{{item.content}} *{{item.count}}</span>
  </div>
</template>
<script>
export default {
  props:{
    item:Object,
  },
  name: "ai-report-nice",
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
        const nice = this.$refs.nice;
        nice[nice.length-1].scrollIntoView({
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
