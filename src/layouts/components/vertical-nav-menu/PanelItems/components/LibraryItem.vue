<template>
  <div class="vx-card">
    <div class="vx-card__collapsible-content vs-con-loading__container ">
      <div class="vx-card__header">
        <div class="vx-card__title">
          <h4>{{ $t('studio.sidebarPanel.library.l2') }} {{ sceneNum + 1 }}</h4>
          <h6>{{ $t('LibraryItem.select') }}</h6>
        </div>
      </div>
      <div class="vx-card__body ">
        <vs-tabs v-model="activeTabIndex" class=" -mr-3">
          <vs-tab :label="$t('LibraryItem.videos')">
            <vx-input-group class="mb-2">
              <vs-input
                v-model="searchQuery"
                :placeholder="$t('studio.sidebarPanel.library.l6')"
              />
              <template slot="append">
                <div class="append-text btn-addon">
                  <vs-button
                    color="primary"
                    class="vs-con-loading__container"
                    id="button-with-loading"
                    icon-pack="feather"
                    icon="icon-search"
                    :disabled="searchInProgress"
                    @click="searchMedia"
                  ></vs-button>
                </div>
              </template>
            </vx-input-group>
            <div>
              <vs-row v-if="keywords.length !== 0" class="mb-base">
                <p
                  v-for="(k, indexk) in keywords"
                  :key="`scene_${sceneNum}_${indexk}`"
                  class="font-semibold mr-3"
                  @click="addsearchVideo(k)"
                  style="
                    cursor: pointer;
                    white-space: normal;
                    overflow-wrap: break-word;
                    line-break: anywhere;
                  "
                >
                  <u>#{{ k }}</u>
                </p>
              </vs-row>
              <div v-else>
                <p
                  style="
                    cursor: pointer;
                    white-space: normal;
                    overflow-wrap: break-word;
                    line-break: anywhere;
                  "
                  class="mt-4"
                >
                  {{ $t('LibraryItem.try') }}
                </p>
              </div>
              <component
                :is="scrollbarTag"
                ref="verticalNavMenuPs"
                class="scroll-area scroll-videos pr-3"
                :settings="settings"
                :key="$vs.rtl"
              >
                <div
                  v-for="(video, indexv) in videoList"
                  :key="`v_${sceneNum}_${indexv}`"
                  class="w-full mb-base"
                >
                  <MediaPreview
                    :src="video.url"
                    v-show="video.current_tag"
                    @click.native="selectMedia(video)"
                  />
                  <div
                    class="font-semibold items-left"
                    style="white-space: normal"
                    v-show="video.current_tag"
                  >
                    #{{ video.current_tag }}
                  </div>
                </div>
              </component>
            </div>
          </vs-tab>
          <vs-tab :label="$t('LibraryItem.images')" class=" ">
            <vx-input-group class="mb-2">
              <vs-input
                v-model="searchQuery"
                :placeholder="$t('studio.sidebarPanel.library.l7')"
              />
              <template slot="append">
                <div class="append-text btn-addon">
                  <vs-button
                    color="primary"
                    class="vs-con-loading__container"
                    id="button-with-loading"
                    icon-pack="feather"
                    icon="icon-search"
                    :disabled="searchInProgress"
                    @click="searchMedia"
                  ></vs-button>
                </div>
              </template>
            </vx-input-group>
            
            <div>
              <vs-row v-if="keywords.length !== 0" class="mb-base">
                <p
                  v-for="(k, indexk) in keywords"
                  :key="`scene_${sceneNum}_${indexk}`"
                  class="font-semibold mr-3"
                  @click="addsearchVideo(k)"
                  style="
                    cursor: pointer;
                    white-space: normal;
                    overflow-wrap: break-word;
                    line-break: anywhere;
                  "
                >
                  <u>#{{ k }}</u>
                </p>
              </vs-row>
              <component
                :is="scrollbarTag"
                ref="verticalNavMenuPs"
                class="scroll-area scroll-videos pr-3"
                :settings="settings"
                :key="$vs.rtl"
              >
                <div
                v-for="(image, indexi) in imageList"
                :key="`i_${sceneNum}_${indexi}`"
                  class="w-full mb-base"
                >
                  <MediaPreview
                  :src="image.url"
                  image
                  v-if="image.current_tag"
                  :imageId="`img_${indexi}`"
                  @click.native="selectMedia(image)"
                  />
                  <div
                    class="font-semibold items-left"
                    style="white-space: normal"
                  >
                  #{{ image.current_tag }}
                  </div>
                </div>
              </component>
            </div>
          </vs-tab>
          <vs-tab :label="$t('LibraryItem.uploads')"  class=" ">
            <div class="text-center mb-base mt-3">
              <input
                type="file"
                :id="`realfile${sceneNum}`"
                @change="(e) => uploadFile(e, null, '')"
                @click="clearFile"
                class="hidden"
                accept="video/*,image/*"
              />
              <vs-button
                size="medium"
                id="button-with-loading-library"
                class="vs-con-loading__container"
                :disabled="uploadInProgress"
                @click="chooseFile"
              >
                {{ $t('LibraryItem.upload_media') }}
              </vs-button>
            </div>
            <component
              :is="scrollbarTag"
              ref="verticalNavMenuPs"
              class="scroll-videos scroll-default pr-3"
              :settings="settings"
              :key="$vs.rtl"
            >
              <div
                v-for="(media, indexu) in uploadedMedia"
                :key="`uv_${indexu}`"
                class="w-full mb-base"
              >
                <h6 class="mb-3 truncate .max-w-xxs">{{ media.fileName }}</h6>
                <MediaPreview
                  v-if="isImageUrl(media.url)"
                  :src="media.url"
                  image
                  :imageId="`u_img_${indexu}`"
                  @click.native="selectMedia({ id: null, url: media.url })"
                />
                <MediaPreview
                  v-else
                  :src="media.url"
                  @click.native="selectMedia({ id: null, url: media.url })"
                />
              </div>
            </component>
          </vs-tab>
          <vs-tab label="Generate">
            <div class="text-center mb-base mt-3">
              <div>
                <textarea
                  type="text"
                  id="prompt"
                  name="script"
                  placeholder="Write Prompt to generate Image"
                  v-model="prompt"
                  v-validate="'required'"
                  class="w-full mt-3 mb-3 video-script2"
                >
                </textarea>
              </div>
              <br />
              <vs-button
                size="medium"
                id="button-with-loading-library"
                class="vs-con-loading__container"
                :disabled="uploadInProgress"
                @click="generateImage"
              >
                Generate Image
              </vs-button>
            </div>
          </vs-tab>
        </vs-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import MediaPreview from './MediaPreview';
import { utils } from '@/mixins/index.js';
export default {
  name: 'LibraryItem',
  mixins: [utils],
  components: { MediaPreview, VuePerfectScrollbar },
  data() {
    return {
      searchQuery: '',
      playPromise: null,
      searchInProgress: false,
      tabIndex: 0,
      uploadInProgress: false,
      name: '',
      url: '',
      prompt: '',
      settings: {
        // perfectScrollbar settings
        maxScrollbarLength: 80,
        wheelSpeed: 1,
        swipeEasing: true,
      },
      /* defaultVideo: [
        '',
        'https://player.vimeo.com/external/183300007.hd.mp4?s=ca181ca041236fab57280de20de21b78a202bbf8&profile_id=174',
      ], */
    };
  },
  props: ['keywords', 'sceneNum'],
  computed: {
    uploadedMedia() {
      return this.$store.state.studio.uploadedMedia;
    },
    videoList() {
      return this.$store.state.studio.videos[this.sceneNum];
    },
    imageList() {
      return this.$store.state.studio.images[this.sceneNum];
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    generatePrompt() {
      return this.$store.state.studio.scenes[this.sceneNum];
    },
    uploadedDocumentIsPPT() {
      return this.$store.state.studio.isPPT;
    },
    activeTabIndex: {
      get() {
        if (this.uploadedDocumentIsPPT) {
          return 1;
        } else return this.tabIndex;
      },
      set(val) {
        this.tabIndex = val;
      },
    },
  },
  mounted() {
    console.log(this.generatePrompt);
  },
  watch: {
    generatePrompt: {
      immediate: true,
      handler(newVal) {
        this.prompt = newVal;
      },
    },
  },
  methods: {
    generateImage() {
      const text = document.getElementById('prompt').value;
      this.$vs.loading();

      this.$store
        .dispatch('studio/generateImage', text)
        .then((res) => {
          console.log(res);
          this.url = res.url;
          this.selectMedia({ id: null, url: res.url });
        })
        .catch((e) => {
          console.log(e);
        })
        .finally(() => {
          this.$vs.loading.close();
        });
    },
    clearFile(event) {
      event.target.value = '';
    },
    checkUrl(url) {
      const media = url.split('.');
      if (media[media.length - 1] !== 'mp4') return false;
      return true;
    },
    chooseFile() {
      document.getElementById(`realfile${this.sceneNum}`).click();
    },
    uploadFile(event, taskId, name) {
      const selectedFile =
        taskId === null
          ? {
              media: event.target.files[0],
              task_id: taskId,
            }
          : {
              media: name,
              task_id: taskId,
            };
      // if (selectedFile.media.size / 1048576 > 75) {
      //   this.$vs.notify({
      //     title: 'Video too large',
      //     text: 'upload a video with size less than 75mb',
      //     color: 'danger',
      //     time: 3000,
      //   });
      //   return;
      // }
      this.uploadInProgress = true;
      this.$vs.loading({
        background: 'primary',
        color: '#fff',
        container: '#button-with-loading-library',
        scale: 0.45,
      });
      this.$store
        .dispatch('studio/uploadMedia', selectedFile)
        .then((res) => {
          if (res.data.status === 'SUCCESS') {
            const dataObj = {
              fileName: name,
              url: res.data.media_url,
            };
            this.$store.commit('studio/setUploadedMedia', dataObj);
            document.getElementById(`realfile${this.sceneNum}`).value = '';
            this.uploadInProgress = false;
            this.$vs.loading.close(
              '#button-with-loading-library > .con-vs-loading'
            );
          } else {
            name = name === '' ? event.target.files[0].name : name;
            taskId = res.data.task_id !== undefined ? res.data.task_id : taskId;
            setTimeout(() => {
              this.uploadFile(event, taskId, name);
            }, 2000);
          }
        })
        .catch(() => {
          this.$vs.notify({
            title: this.$t('LibraryItem.upload_notify.title'),
            text: this.$t('LibraryItem.upload_notify.text'),
            color: 'danger',
          });
          document.getElementById(`realfile${this.sceneNum}`).value = '';
          this.uploadInProgress = false;
          this.$vs.loading.close(
            '#button-with-loading-library > .con-vs-loading'
          );
        });
    },
    selectMedia(mediaObj) {
      this.$store.commit('studio/selectMedia', {
        value: {
          id: mediaObj.id,
          url: mediaObj.url,
        },
        sceneNum: this.sceneNum,
      });
    },
    addsearchVideo(k) {
      this.searchQuery = k;
      this.searchMedia();
    },
    addKeyword() {
      const payload = {
        keyword: this.searchQuery,
        sceneNum: this.sceneNum,
      };
      this.$store.commit('studio/addKeyword', payload);
    },
    searchMedia() {
      this.searchInProgress = true;
      this.$vs.loading({
        background: 'primary',
        color: '#fff',
        container: '#button-with-loading',
        scale: 0.4,
      });
      const mediaType = this.tabIndex === 0 ? 'video' : 'image';
      const dataObj = {
        searchQuery: this.searchQuery,
        srcLang: this.$store.state.studio.video.language,
        type: mediaType,
      };
      this.$store
        .dispatch('studio/searchMedia', dataObj)
        .then((res) => {
          if (Object.keys(res.data).length === 0) {
            this.$vs.notify({
              title: this.$t('LibraryItem.search_notify.title'),
              text: `Cannot find ${mediaType}s related to this keyword`,
              color: 'danger',
            });
          } else {
            const dataObj = {
              sceneNum: this.sceneNum,
              value: res.data,
            };
            mediaType === 'video'
              ? this.$store.commit('studio/setSearchedVideos', dataObj)
              : this.$store.commit('studio/setSearchedImages', dataObj);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.searchInProgress = false;
          this.$vs.loading.close('#button-with-loading > .con-vs-loading');
        });

      if (!this.keywords.includes(this.searchQuery)) {
        this.addKeyword();
      }
    },
  },
};
</script>

<style scoped>
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
.scroll-area {
  position: relative;
  width: 100%;
}
.scroll-videos {
  height: 45vh;
}
.scroll-default {
  height: 60vh;
}
</style>
