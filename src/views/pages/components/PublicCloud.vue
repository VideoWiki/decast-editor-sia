<template>
  <div class="main-container">
    <div class="heading">Public Cloud</div>
    <div class="sub-heading">Connect to VideoWiki cloud to upload a video</div>
    <div class="mt-6">
      <video controls>
        <source :src="videoData.url" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="button">
      <button class="cursor-pointer" @click="save">
        Publish Online on VideoWiki
      </button>
    </div>
  </div>
</template>
<script>
import constants from '../../../../constant';
import { utils } from '@/mixins/index.js';
export default {
  mixins: [utils],
  name: 'publicCloud',
  data() {
    return {
      finalScenes: [],
      showTransactionModal: false,
      concatStatus: true,
    };
  },
  computed: {
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
  methods: {
    save() {
      this.$vs.loading();
      const payload = {
        file: this.videoData.url,
        container: constants.container,
        connectSTr: `DefaultEndpointsProtocol=https;AccountName=${constants.Account};AccountKey=${constants.key};EndpointSuffix=${constants.suffix}`,
      };
      this.$store
        .dispatch('studio/uploadToCloud', payload)
        .then((res) => {
          console.log('response', res);
          this.checkStatus(res.task_id);
        })
        .catch((e) => {
          this.$vs.loading.close();
        });
    },
    checkStatus(taskId) {
      this.$store
        .dispatch('studio/checkStatus', taskId)
        .then(async (res) => {
          if (res.status === 'SUCCESS') {
            this.$vs.loading.close();
            await this.publishVideo();
          } else {
            setTimeout(() => this.checkStatus(taskId), 5000);
          }
        })
        .catch((e) => {
          this.$vs.loading.close();
          console.log(e);
          alert('error occured');
        });
    },
    getPostData() {
      const studioState = this.$store.state.studio;
      const data = {
        USER_ID: this.usersData.id,
        user_id: this.usersData.id,
        user_name: this.usersData.first_name + ' ' + this.usersData.last_name,
        email: this.usersData.email,
        first_name: this.usersData.first_name,
        last_name: this.usersData.last_name,
        profile_pic: this.usersData.profile_pic,
        ...this.videoData,
        scenes: this.getSceneData(studioState, false),
        tags: studioState.tags,
      };
      return data;
    },
    async publishVideo() {
      // this.$Progress.start();
      // this.$vs.loading({ color: 'transparent' });
      const data = this.getPostData();
      console.log({ publishVideo: data });
      /* Ajax call start */
      this.$store
        .dispatch('studio/publishVideo', data)
        .then((res) => {
          this.$Progress.finish();
          this.$vs.loading.close();
          this.$router.push('/dashboard');
          this.$vs.notify({
            title: 'Success',
            text: 'Video Published Successfully',
            color: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$Progress.fail();
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Error',
            text: 'Video was not published',
            color: 'danger',
          });
        });
    },
    getSceneData(studioState, saving) {
      this.getFinalScenes();
      const scenes = {};
      console.log(this.scenes);
      console.log(this.finalScenes);
      Object.values(this.scenes)
        .filter((scene, index) => {
          return !!studioState.selectedFromLibraryMedia[index];
        })
        .forEach((value, index) => {
          const { font_color, text_position, background_color, animation } =
            studioState.styles[index];

          scenes[index] = {
            title: `sceneNo${index}`,
            transition: this.sceneTransitionList[index] || '',
            subtitle: {
              text: value,
              style: {
                alignment: 'left',
                font_style: 'roboto',
                font_size: '14',
                font_type: 'bold',
                text_position,
                font_color,
                background_color,
              },
            },
            media: {
              url: saving
                ? this.finalScenes[index]
                : studioState.selectedFromLibraryMedia[index].url,
              source: 'library',
              type: 'image',
              source_site: 'pixaby',
              lib_media_id: studioState.selectedFromLibraryMedia[index].id,
              duration: null,
              animation: animation || 'none',
            },
            audio: {
              source: 'upload',
              url: studioState.recordedAudios[index] || null,
            },
            keywords: studioState.keywords[index],
          };
          // get media source and type
          if (scenes[index].media.url) {
            const videoUrl = new URL(scenes[index].media.url);
            const urlType = this.isImageUrl(scenes[index].media.url)
              ? 'image'
              : 'video';
            scenes[index].media.source =
              videoUrl.origin === constants.apiUrl ? 'upload' : 'library';
            scenes[index].media.type = urlType;
          }
        });
      return scenes;
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
  /* width: 740px; */
}

.button {
  margin-top: 60px;
  display: flex;
  justify-content: center;
}
.button button {
  width: 330px;
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
