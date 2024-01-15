<template>
  <div class="main-container">
    <div class="heading">Local Disk</div>
    <div class="sub-heading">Save your video into your local system</div>
    <div class="mt-6">
      <video
        @loadedmetadata="setDuration"
        ref="videoElement"
        height="auto"
        :src="videoData.url"
        id="preview_video"
        controls
      >
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="button">
      <button class="cursor-pointer" @click="handleDownload">Download</button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'localDisk',
  computed: {
    videoData() {
      return this.$store.state.studio.video;
    },
  },
  methods: {
    setDuration(e) {
      this.$store.commit('studio/setVideoDuration', e.target.duration);
    },
    async handleDownload() {
      this.$vs.loading();
      const name = this.videoData.url.split('/');
      try {
        const response = await fetch(this.videoData.url);
        const blo = await response.blob();
        const blob = new Blob([blo], { type: 'video/webm' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = name[name.length - 1];
        console.log(link);
        link.click();
        URL.revokeObjectURL(link.href);
        this.$vs.notify({
          title: 'Success',
          text: 'Video Download Successfully',
          color: 'success',
          fixed: true,
          click: () => {},
        });
      } catch (e) {
        this.$vs.notify({
          title: 'Error occurred',
          text: 'Download Failed',
          color: 'danger',
        });
      } finally {
        this.$vs.loading.close();
      }
    },
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');
.main-container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  padding: 50px 0px;
  font-family: 'Inter', sans-serif !important;
}

.heading {
  font-weight: 800;
  font-size: 24px;
  color: #101828;
}
.sub-heading {
  font-weight: 500;
  font-size: 16px;
  color: #667085;
  margin-top: 4px;
}

.video video {
  width: 740px;
  height: 456px;
}
.button {
  margin-top: 60px;
  display: flex;
  justify-content: center;
}
.button button {
  width: 178px;
  height: 62px;
  background-color: #7966fa;
  border-radius: 60px;
  padding: 20px 40px 20px 40px;
  border: none;
  font-weight: 600;
  font-size: 18px;
  display: flex;
  align-items: center;
  color: #ffffff;
  gap: 10px;
}
</style>
