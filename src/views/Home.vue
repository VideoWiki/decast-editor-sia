<template>
  <div class="items-center">
    <WebexBot />
    <MsTeams />
    <div class="w-full lg:w-2/3 md:w-4/5">
      <EditScript v-if="$store.state.studio.panel.text" />
      <SelectVideos v-else-if="$store.state.studio.panel.library" />
      <!--FormatVideo v-else-if="$store.state.studio.panel.style" /-->
      <EditScenes v-else-if="$store.state.studio.panel.scenes" />
      <AddMusic v-else-if="$store.state.studio.panel.music" />
      <Storage v-else-if="$store.state.studio.panel.store" />
      <PublishVideo v-else-if="$store.state.studio.panel.publish" />
    </div>
  </div>
</template>

<script>
import EditScript from './pages/EditScript';
import SelectVideos from './pages/SelectMedia';
import PublishVideo from './pages/PublishVideo';
import EditScenes from './pages/EditScenes';
import AddMusic from './pages/AddMusic';
// import FormatVideo from './pages/FormatVideo';
import MsTeams from './Integrations/MsTeams/Main';
import WebexBot from './Integrations/WebexBot/WebexBot';
// import Decentralize from './pages/Decentralize.vue';
import Storage from './pages/Storage.vue';
export default {
  data() {
    return {};
  },
  components: {
    // FormatVideo,
    AddMusic,
    EditScenes,
    PublishVideo,
    SelectVideos,
    EditScript,
    MsTeams,
    WebexBot,
    // Decentralize,
    Storage,
  },
  created() {
    if (this.$route.params.videoId) {
      this.$Progress.start();
      this.$vs.loading({ color: 'transparent' });
      this.getVideoData();
    } else this.clearState();
    if (window.location !== window.parent.location) {
      document.body.style.zoom = '0.8';
    }
    if (
      localStorage.getItem('script') &&
      !this.$route.params.videoId &&
      !this.$route.query.meetingId
    ) {
      this.acceptBox();
    }
  },
  mounted() {
    if (this.$route.query.meetingId) {
      this.$Progress.start();
      this.$vs.loading({ color: 'transparent' });
      this.getVideoChunks(this.$route.query.meetingId);
    }
    // Clear all query params
    if (Object.keys(this.$route.query).length !== 0) {
      this.$router.replace({ query: null });
    }
  },
  methods: {
    confirmBox() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: 'Continue Editing',
        acceptText: 'Continue',
        text: 'Would you like to Continue Editing the Previous Video or Start a New One?',
        accept: this.acceptBox,
        cancel: this.cancelBox,
      });
    },
    acceptBox(color) {
      this.$vs.notify({
        color: 'success',
        title: 'ALERT:',
        text: 'Continue With Your Previous Video, Your Data will be filled Automatically',
      });
      this.Auto_fill = true;
      this.localStorageSet();
    },
    cancelBox(color) {
      this.$vs.notify({
        color: 'warning',
        title: 'ALERT:',
        text: 'Your Previous Video Project has been discarded, start a New',
      });
      this.localStorageDel();
    },
    localStorageDel() {
      localStorage.removeItem('title');
      localStorage.removeItem('script');
      localStorage.removeItem('description');
      localStorage.removeItem('bg_music');
      localStorage.removeItem('published_id');
      localStorage.removeItem('url');
      localStorage.removeItem('scenes');
    },
    localStorageSet() {
      this.syncLocalStorageData();
      // this.$store.commit('studio/SET_VIDEO', this.localStorageAttributes);
    },
    syncLocalStorageData() {
      this.$vs.loading();
      const localStorageAttributes = {
        title: '',
        script: '',
        description: '',
        language: '',
        bg_music: '',
        published_id: '',
        url: '',
        scenes: [],
      };
      const dataToSync = {};
      for (const key in localStorageAttributes) {
        if (key === 'bg_music' || key === 'scenes') {
          dataToSync[key] = JSON.parse(localStorage.getItem(key));
        } else {
          dataToSync[key] = localStorage.getItem(key);
        }
        console.log(dataToSync);
        this.$store.commit('studio/SET_VIDEO_ATTR', {
          key: key,
          value: dataToSync[key],
        });
      }
      const studioState = this.$store.state.studio;
      this.$store.commit('studio/SET_VIDEO_ATTR', studioState);
      const sentences = {};
      const keywords = {};
      Object.entries(JSON.parse(localStorage.getItem('scenes'))).forEach(
        ([key, value]) => {
          sentences[key] = value.subtitle.text;
          keywords[key] = value.keywords;
          this.$store.commit('studio/setTransition', {
            sceneNum: parseInt(key),
            value: value.transition,
          });
          this.$store.commit('studio/setRecordedAudio', {
            sceneNum: parseInt(key),
            value: value.audio.url,
          });
          this.$store.commit('studio/selectMedia', {
            sceneNum: parseInt(key),
            value: {
              id: value.media.lib_media_id,
              url: value.media.url,
            },
          });
          this.$store.commit('studio/SET_STYLE', {
            sceneNum: parseInt(key),
            value: value.subtitle.style,
          });
        }
      );
      this.$store.commit('studio/setSentences', sentences);
      this.$store.commit('studio/setKeywords', keywords);
      this.$store.commit('studio/skipSubtitles');
      this.$store.commit('studio/skipMusic');
      this.$store
        .dispatch('studio/videoSuggestions')
        .then(() => {})
        .catch((err) => {
          if (err.response.status === 401) {
            this.$vs.notify({
              title: 'Login Expires',
              text: 'Login to continue',
              color: 'danger',
            });
            this.$cookies.remove('userId');
            this.$cookies.remove('Token');
            setTimeout(() => {
              this.$router.push('/login');
            }, 500);
            setTimeout(() => {
              this.$store.dispatch('auth/logOut');
            }, 600);
            return;
          }
          this.$router.push('/myvideos');
          this.$vs.notify({
            title: 'Error',
            text: 'Cannot fetch video data',
            color: 'danger',
          });
        });
      setTimeout(() => {
        this.$vs.loading.close();
        this.$store.commit('studio/togglePublish');
      }, 1000);
      /* dataToSync.scenes = this.scenes;
      console.log(this.scenes);  */
    },
    getVideoData() {
      this.$store
        .dispatch('studio/getVideoData', this.$route.params.videoId)
        .then(() => {
          this.$store
            .dispatch('studio/videoSuggestions')
            .then(() => {
              this.$Progress.finish();
            })
            .catch((err) => {
              this.$Progress.fail();
              if (err.response.status === 401) {
                this.$vs.notify({
                  title: 'Login Expires',
                  text: 'Login to continue',
                  color: 'danger',
                });
                this.$cookies.remove('userId');
                this.$cookies.remove('Token');
                setTimeout(() => {
                  this.$router.push('/login');
                }, 500);
                setTimeout(() => {
                  this.$store.dispatch('auth/logOut');
                }, 600);
                return;
              }
              this.$router.push('/myvideos');
              this.$vs.notify({
                title: 'Error',
                text: 'Cannot fetch video data',
                color: 'danger',
              });
            })
            .finally(() => {
              this.$vs.loading.close();
            });
        })
        .catch((err) => {
          this.$vs.loading.close();
          if (err.response.status === 401) {
            this.$vs.notify({
              title: 'Login Expires',
              text: 'Login to continue',
              color: 'danger',
            });
            this.$cookies.remove('userId');
            this.$cookies.remove('Token');
            setTimeout(() => {
              this.$router.push('/login');
            }, 500);
            setTimeout(() => {
              this.$store.dispatch('auth/logOut');
            }, 600);
            return;
          }
          this.$router.push('/myvideos');
          this.$vs.notify({
            title: 'Error',
            text: 'Cannot fecth video data',
            color: 'danger',
          });
        });
    },
    getVideoChunks(meetingId) {
      this.$store
        .dispatch('studio/fetchVideoChunks', meetingId)
        .then((apiResponse) => {
          const scenes = {};
          const videos = {};
          const images = {};
          const keywords = {};
          console.log(apiResponse.data);
          apiResponse.data.forEach((chunkUrl, index) => {
            scenes[index] = '*add scene script*';
            videos[index] = '';
            images[index] = '';
            keywords[index] = [];
            this.$store.commit('studio/setInitialVideo', {
              indexs: index,
              value: {
                id: null,
                url: chunkUrl,
              },
            });
          });
          this.$store.commit('studio/setSentences', scenes);
          this.$store.commit('studio/setVideos', videos);
          this.$store.commit('studio/setKeywords', keywords);
          this.$store.commit('studio/setImages', images);
          this.$Progress.finish();
          this.$vs.loading.close();
          setTimeout(() => this.$store.commit('studio/toggleLibrary'), 1000);
        })
        .catch((err) => {
          this.$Progress.fail();
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Error',
            text: err.response.data.message,
            color: 'danger',
          });
        });
    },
    clearState() {
      this.$store.dispatch('studio/resetState');
    },
  },
};
</script>

<style scoped>
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

.items-right {
  text-align: right;
  text-align: -moz-right;
  text-align: -webkit-right;
}
</style>
