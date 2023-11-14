<template>
  <div class="container">
    <div id="videoPlayer" style="display: flex;justify-content: center;">
      <video controls style="width:56vw;height: 56vh;"></video>
    </div>
  </div>
</template>
<script>
export default {
  name: 'stream-douyin-flv',
  data() {
    return {
      flvPlayer: null,
      videoUrl:null,
      lastDecodedFrame:""
    }
  },
  mounted() {
  },
  methods: {

    broadcast(url) {
      if(this.flvPlayer){
        this.destoryVideo()
      }
      if(url.flvUrl){
        this.videoUrl=url.flvUrl
      }else{
        this.videoUrl=url.mu38Url
      }
      if (this.videoUrl == ''){
        alert('请输入视频链接');
        return;
      }
       this.videoUrl = this.httpToHttps(this.videoUrl);
      const video = document.querySelector('#videoPlayer video');
      if (this.videoUrl.includes('.m3u8')) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.attachMedia(video);
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(this.videoUrl);
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = this.videoUrl;
        } else {
          alert('M3U8 格式不受您的浏览器支持。');
          console.error('M3U8 格式不受您的浏览器支持。');
          return;
        }
      } else if (this.videoUrl.includes('.flv')) {
        if (flvjs.isSupported()) {
          this.flvPlayer = flvjs.createPlayer({
            type: 'flv',
            isLive:true,
            url: this.videoUrl,
            hasAudio:true
          },
            {
              autoCleanupSourceBuffer: true, //对SourceBuffer进行自动清理缓存
              autoCleanupMaxBackwardDuration: 120, //    当向后缓冲区持续时间超过此值（以秒为单位）时，请对SourceBuffer进行自动清理
              autoCleanupMinBackwardDuration: 60, //指示进行自动清除时为反向缓冲区保留的持续时间（以秒为单位）。
              enableStashBuffer: false, //关闭IO隐藏缓冲区
              reuseRedirectedURL: true, //重用301/302重定向url，用于随后的请求，如查找、重新连接等。
              stashInitialSize: 128
            }
          );
          this.flvPlayer.attachMediaElement(video);
          if (this.videoUrl !== "" && this.videoUrl !== null) {
            this.flvPlayer.load();
            this.flvPlayer.play();
          }
          //视频流延迟
          setInterval(() => {
            if (!this.flvPlayer) return;
            if (this.flvPlayer.buffered.length) {
              let end = this.flvPlayer.buffered.end(0); //获取当前buffered值
              let diff = end - this.flvPlayer.currentTime; //获取buffered与currentTime的差值
              if (diff >= 4) {
                console.log("处理延迟");
                //如果差值大于等于4 手动跳帧 这里可根据自身需求来定
                this.flvPlayer.currentTime = this.flvPlayer.buffered.end(0) - 1.5; //手动跳帧
              }
            }
          }, 2000); //2000毫秒执行一次
          this.flvPlayer.on(flvjs.Events.ERROR, (errType, errDetail) => {
            // alert("网络波动,正在尝试连接中...");
            console.log("网络波动,正在尝试连接中...", this.flvPlayer, "视频状态");
            if (this.flvPlayer) {
              this.reloadVideo();
            }
          });
          this.flvPlayer.on("statistics_info", function (res) {
            if (this.lastDecodedFrame == 0) {
              this.lastDecodedFrame = res.decodedFrames;
              return;
            }
            if (this.lastDecodedFrame != res.decodedFrames) {
              this.lastDecodedFrame = res.decodedFrames;
            } else {
              this.lastDecodedFrame = 0;
              if (this.flvPlayer) {
                this.reloadVideo(this.flvPlayer);
              }
            }
          });
        } else {
          alert('FLV 格式不受您的浏览器支持。');
          console.error('FLV 格式不受您的浏览器支持。');
          return;
        }
      } else {
        console.error('不支持播放该视频格式。');
        alert('不支持播放该视频格式。');
      }
    },
    httpToHttps(videoUrl){
      if (videoUrl.startsWith("http://")) {
        return videoUrl.replace("http://", "https://");
      }
      return videoUrl;
    },
    // 执行销毁 后在创建
    reloadVideo() {
      this.destoryVideo();
      this.broadcast();
    },
    destoryVideo() {
      this.flvPlayer.pause();
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.flvPlayer.destroy();
      this.flvPlayer = null;
    }
  },

}
</script>
<style>





</style>
