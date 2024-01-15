<template>
  <div class="main-container">
    <div class="center-container" id="previewLoading">
      <div class="heading">
        <div class="main-heading">Decentralized</div>
        <div class="sub-heading">
          Connect Decentralized storage to publish a video
        </div>
      </div>
      <div class="boxes">
        <!-- <div class="box flex">
            <img src="@/assets/images/editor/ipfs.svg" alt="" />
            <div class="text">VideoWiki IPFS</div>
          </div>
          <div class="box flex">
            <img src="@/assets/images/editor/ipfs.svg" alt="" />
            <div class="text">Private IPFS</div>
          </div> -->
        <div
          id="swarm-upload-button"
          class="box flex cursor-pointer"
          @click="click(undefined, undefined)"
        >
          <img src="@/assets/images/editor/Vector.svg" alt="" />
          <div class="info-container">
            <button class="text">Fairdrive</button>
            <div class="about">
              A decentralized app for secure, private data storage.
            </div>
          </div>
        </div>

        <div class="box flex cursor-pointer" @click="uploadToSia">
          <img src="@/assets/images/sia.png" alt="" />
          <div class="info-container">
            <button class="text">Sia</button>
            <div class="about">
              Sia is a thriving ecosystem of data storage enthusiasts.
            </div>
          </div>
        </div>
      </div>
    </div>
    <Transaction
      :show="showTransactionModal"
      transactionType="Publish"
      :transactionPhase="'Processing'"
      @close="showTransactionModal = false"
    />
  </div>
</template>
<script>
import Transaction from '@/views/components/Transaction/Transaction.vue';
import { utils } from '@/mixins/index.js';
import constants from '../../../constant';
import axios from '../../axios';
export default {
  mixins: [utils],
  name: 'Decenteralize',
  data() {
    return {
      finalScenes: [],
      showTransactionModal: false,
      concatStatus: true,
      storageOption: '',
    };
  },
  components: {
    Transaction,
  },

  mounted() {
    this.getFinalScenes();
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
    click() {
      // console.log(encodeURIComponent(this.videoData.url));
      // var left = screen.width - 420;
      // window.open(
      //   `https://fairos.video.wiki/login/${encodeURIComponent(
      //     this.videoData.url
      //   )}/?id=${this.usersData.id}`,
      //   'newwin',
      //   `resizable=no,height=1${window.innerHeight},width=600px,left=${left}`
      // );
      this.storageOption = 'swarm';
      if (document.getElementsByClassName('swarmHeading').length) {
        var left = screen.width - 420;
        console.log(encodeURIComponent(this.videoData.url));
        window.open(
          `https://fairos.video.wiki/login/${encodeURIComponent(
            this.videoData.url
          )}/?id=${this.usersData.id}`,
          'newwin',
          `resizable=no,height=1${window.innerHeight},width=600px,left=${left}`
        );
      } else {
        this.$vs.notify({
          title: 'Extension not found',
          text: 'Install extension and refresh to continue',
          color: 'danger',
        });
      }
    },
    // async click(mnemonic, address) {
    //   this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 1);
    //   this.showTransactionModal = true;
    //   console.log(this.videoData.url, this.usersData);
    //   const login = await this.$store.dispatch('swarmLogin', {
    //     username: this.usersData.id,
    //     url: this.videoData.url,
    //     mnemonic,
    //     address,
    //   });
    //   if (login.mnemonic) {
    //     setTimeout(() => {
    //       this.click(login.mnemonic, login.address);
    //     }, 5000);
    //     return;
    //   }
    //   let cookie = await this.$store.dispatch('login', this.usersData.id);
    //   console.log(12);
    //   cookie = cookie.result;
    //   cookie = cookie.split('=');
    //   console.log(cookie);
    //   document.cookie = 'fairOS-dfs=' + cookie[1] + '=';
    //   // document.cookie = cookie;
    //   this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 2);
    //   const upload = await this.$store.dispatch('swarmUpload', {
    //     username: this.usersData.id,
    //     url: this.videoData.url,
    //   });
    //   console.log(upload);
    //   this.getStatus(upload.task_id);
    // },
    async getStatus(taskId) {
      try {
        const res = await this.$store.dispatch('swarmUploadStatus', taskId);
        console.log(res);
        if (res.data.status === 'SUCCESS') {
          console.log('res');
          const result = JSON.parse(res.data.result);
          console.log(result);
          if (result.Responses[0].message === 'uploaded successfully') {
            this.showTransactionModal = false;
            this.publishVideo();
          } else {
            this.$vs.notify({
              title: 'Error',
              text: `Failed to upload video try again`,
              color: 'danger',
            });
          }
        } else {
          setTimeout(() => this.getStatus(taskId), 2000);
        }
      } catch (e) {
        console.log(e.response);
        this.showTransactionModal = false;
      }
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
      const data = this.getPostData();
      data.is_paid = true;
      console.log({ publishVideo: data });
      /* Ajax call start */
      try {
        const res = await this.$store.dispatch('studio/publishVideo', data);

        let path = this.videoData.url.split('/');
        path = '/' + path[path.length - 1];

        if (this.storageOption === 'swarm') {
          const swarmPayload = {
            dataToken: 'swarm',
            dod: path,
            exchange_key: '',
            paid: this.videoData.is_paid,
            video_id: res.data.id,
            price: '1',
            preview_url: 'ipfsUrl',
          };

          await this.$store.dispatch('studio/postTxData', swarmPayload);
        } else if (this.storageOption === 'sia') {
          const siaPayload = {
            dataToken: 'sia',
            dod: path,
            exchange_key: '',
            paid: this.videoData.is_paid,
            video_id: res.data.id,
            price: '1',
            preview_url: 'ipfsUrl',
          };

          await this.$store.dispatch('studio/postTxData', siaPayload);
        }

        this.$Progress.finish();
        this.$vs.loading.close();
        this.$router.push('/dashboard');
        this.$vs.notify({
          title: 'Success',
          text: 'Video Published Successfully',
          color: 'success',
        });
      } catch (err) {
        console.log(err);
        this.$Progress.fail();
        this.$vs.loading.close();
        this.$vs.notify({
          title: 'Error',
          text: `Video Tx data for ${this.storageOption} was not saved`,
          color: 'danger',
        });
      }
    },
    getSceneData(studioState, saving) {
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
    async uploadToSia() {
      this.storageOption = 'sia';
      console.log('Uploading to Sia');
      try {
        console.log(this.videoData);
        this.$vs.loading();
        const videoUrl = this.videoData.url;
        const data = {
          file_url: videoUrl,
        };
        console.log(data);
        const response = await axios.post(
          'https://api.storage.video.wiki/api/sia/upload/',
          data,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        this.$vs.loading.close();
        this.showDownload = true;
        this.publishVideo();
        this.$vs.notify({
          title: 'Success',
          text: 'Video Published Successfully',
          color: 'success',
        });
        console.log('Upload successful', response, response.data);
      } catch (error) {
        this.$vs.loading.close();
        this.$vs.notify({
          title: 'Error occurred',
          color: 'danger',
        });
        console.error('Error uploading to Sia via proxy', error);
      }
    },
  },
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap');

.main-container {
  background-color: #ffffff !important;
  padding: 25% 0;
}

.center-container {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

.heading {
  height: 60px;
}

.main-heading {
  font-size: 24px;
  font-weight: 800;
  line-height: 29.05px;
  color: #101828;
}

.sub-heading {
  font-size: 16px;
  font-weight: 500;
  line-height: 19.36px;
  color: #667085;
  margin-top: 5px;
}

.boxes {
  margin-top: 20px;
}

.box {
  width: 457px;
  height: 76px;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  margin-bottom: 10px;
  align-items: center;
}

.box img {
  width: 32px;
  height: 32px;
  margin-left: 20px;
  margin-right: 30px;
}

.text {
  font-size: 18px;
  font-weight: 600;
  color: #667085;
  cursor: pointer;
  background: none;
  border: none;
  margin: auto;
}

.about {
  font-size: 11px;
  width: auto;
  color: #667085;
  font-family: 'Inter', sans-serif;
}

.info-container {
  text-align: left;
}
</style>
