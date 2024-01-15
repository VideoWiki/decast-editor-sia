<template>
  <div>
    <div></div>
    <div id="preview-loading" class="vs-con-loading__container">
      <Decentralize v-if="currentTabIndex === 0" />
      <LocalDisk :url="url" v-else-if="currentTabIndex === 1" />
      <PublicCloud v-else-if="currentTabIndex === 2" />
      <PrivateCloud v-else />
    </div>
  </div>
</template>

<script>
import Decentralize from './Decentralize.vue';
import LocalDisk from './components/LocalDisk.vue';
import PublicCloud from './components/PublicCloud.vue';
import PrivateCloud from './components/PrivateCloud/PrivateCloud.vue';
export default {
  components: {
    Decentralize,
    PrivateCloud,
    PublicCloud,
    LocalDisk,
  },
  data() {
    return {
      finalScenes: [],
      showTransactionModal: false,
      concatStatus: true,
      previewReq: '',
      url: '',
    };
  },
  computed: {
    currentTabIndex() {
      return this.$store.state.studio.tabIndex;
    },
    usersData() {
      return this.$store.state.AppActiveUser;
    },
    scenes() {
      return this.$store.state.studio.scenes;
    },
    sceneTransitionList() {
      return this.$store.state.studio.sceneTransition;
    },
    videoData() {
      return this.$store.state.studio.video;
    },
  },
  mounted() {
    if (this.videoData.url) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: `Confirm`,
        acceptText: 'Yes',
        text: 'Do you want to generate the Preview again ?',
        accept: this.collectScenes,
      });
    } else {
      this.collectScenes();
    }
  },
  beforeDestroy() {
    document.querySelectorAll('body > div.vs-component').forEach((el) => {
      el.remove();
    });
    document.querySelectorAll('body > div.vs-content-sidebar').forEach((el) => {
      el.remove();
    });
    clearTimeout(this.previewReq);
  },
  methods: {
    collectScenes() {
      this.concatStatus = true;
      this.$store.commit('studio/setPreviewVideo', null);
      // this.$vs.loading();
      this.$vs.loading({
        background: '#fff',
        container: '#preview-loading',
        text: 'Generating Preview...',
      });

      this.getFinalScenes();
      this.concatVideos(null);
    },
    async concatVideos(taskId) {
      console.log('concating videos');
      const collectedScenes = {
        videos: this.finalScenes,
        task_id: taskId,
        isPreview: 1,
        width: '480',
        height: '360',
        motions: this.sceneTransitionList,
        bgm: this.videoData.bg_music.url || null,
        email: '',
      };
      try {
        const apiResponse = await this.$store.dispatch(
          'studio/concatenateVideos',
          collectedScenes
        );
        console.log(apiResponse);
        taskId =
          apiResponse.task_id === undefined ? taskId : apiResponse.task_id;
        if (apiResponse.status === 'SUCCESS') {
          this.video_url = apiResponse.output.video_url;
          this.$store.commit('studio/SET_VIDEO_ATTR', {
            key: 'url',
            value: apiResponse.output.video_url,
          });
          this.url = apiResponse.output.video_url;
          // this.$vs.loading.close();
          this.$vs.loading.close('#preview-loading > .con-vs-loading');
        } else {
          this.previewReq = setTimeout(() => this.concatVideos(taskId), 5000);
        }
      } catch (err) {
        this.concatStatus = false;
        this.$vs.loading.close();
        this.$vs.notify({
          title: 'Error',
          text: err.response.data.message,
          color: 'danger',
        });
      }
    },
    getFinalScenes() {
      console.log('gettingFinal Scenes');
      this.finalScenes = [];
      const libraryItems = this.$store.state.studio.selectedFromLibraryMedia;
      const preparedScene = this.$store.state.studio.preparedScenesVideos;
      const audioVideo = this.$store.state.studio.addedAudioVideos;
      // TODO: remove this for loop use forEach
      for (let i = 0; i <= Object.keys(this.scenes).length; i++) {
        if (audioVideo[i]) {
          this.finalScenes.push(audioVideo[i]);
        } else if (preparedScene[i]) {
          this.finalScenes.push(preparedScene[i]);
        } else if (libraryItems[i]) {
          const requiredUrl =
            libraryItems[i].animationUrl || libraryItems[i].url;
          this.finalScenes.push(requiredUrl);
        }
      }
    },
  },
};
</script>

<style scoped>
[contentEditable='true']:empty:not(:focus):before {
  content: attr(data-text);
}
::placeholder {
  color: #626262;
  opacity: 0.7;
}

.border {
  border: 0.5px solid lightgray;
}
.title1 {
  height: 40px !important;
  border: none;
  font-size: 14px;
  overflow-y: auto;
  border-radius: 5px;
  color: #626262;
  opacity: 1; /* Firefox */
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}
.title2 {
  height: 40px !important;
  border: 0.5px solid lightgray;
  font-size: 14px;
  overflow-y: auto;
  border-radius: 5px;
  color: #626262;
  opacity: 1; /* Firefox */
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}

.description2 {
  height: 60px !important;
  border-radius: 5px;
  border: 0.5px solid lightgray;
  font-size: 14px;
  overflow-y: auto;
  color: #626262;
  opacity: 1;
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}
.video-script2 {
  height: 250px !important;
  border: 0.5px solid lightgray;
  font-size: 14px;
  overflow-y: auto;
  border-radius: 5px;
  color: #626262;
  opacity: 1;
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}
.video-script.vs-con-textarea >>> .vs-textarea {
  height: 250px !important;
}

.items-center {
  text-align: center;
  text-align: -moz-center;
  text-align: -webkit-center;
}

.items-left {
  text-align: left;
  text-align: -moz-left;
  text-align: -webkit-left;
}

.hoverEffect {
  color: black;
}

.textArea_script {
  border: 0.5px solid lightgray;
  border-radius: 5px;
  color: #626262;
}

.hoverEffect:hover {
  color: white;
  opacity: 0.7;
}

.video-script2 {
  height: 250px !important;
  font-size: 14px;
  resize: none;
  overflow-y: auto;
  border: none;
  opacity: 1;
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}

.items-right {
  text-align: right;
  text-align: -moz-right;
  text-align: -webkit-right;
}

/*.text-window {
    height: 33rem;
    margin-top: calc(100% - 33rem);
  } */
.align {
  height: 5px;
  border: 3px solid white;
  border-radius: 3px;
  padding: 0.5rem;
  margin-bottom: 25px;
}
.result {
  align-items: right;
}
.d-message {
  align-items: left;
}
.text-window .vx-card {
  /*height: 20rem;*/
  border: 0.5px solid gray;
}

.text-window .vx-card div {
  padding: 0.2rem;
  height: 15rem;
  overflow-y: auto;
}
.greenDiv {
  color: green;
}
.redDiv {
  color: red;
}
.text-window .vx-card {
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
