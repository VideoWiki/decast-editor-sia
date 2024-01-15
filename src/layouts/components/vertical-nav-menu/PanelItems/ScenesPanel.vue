<template>
  <div class="vx-card cursor-default" style="height: 100%">
    <div class="vx-card__collapsible-content">
      <div class="vx-card__body">
        <div class="-mr-4">
          <div class="w-full items-center mb-base">
            <h6 class="font-semibold mb-base" style="white-space: normal">
              {{ $t('ScenesPanel.can') }}
            </h6>
            <vs-button @click="prepareAllScenes">{{
              $t('studio.sidebarPanel.course.c3')
            }}</vs-button>
          </div>
          <!-- <div class="w-full items-center mb-base">
            <h6 class="font-semibold mb-base" style="white-space: normal">
              {{ $t('ScenesPanel.can') }}
            </h6>
            <div class="flex-button-div">
              <vs-button @click="prepareAllScenes">
                {{ $t('studio.sidebarPanel.course.c3') }}
              </vs-button>
              <vx-tooltip
                text="view deleted files"
                class="w-1/3 delete-icon-tooltip"
                position="right"
              >
                <DeletedModal :show="showModel" @close="showModel = false" />
              </vx-tooltip>
            </div>
          </div> -->
          <component
            :is="scrollbarTag"
            ref="verticalNavMenuPs"
            class="scroll-area pr-3"
            :settings="settings"
            :key="$vs.rtl"
          >
            <div
              v-for="(media, indexv) in selectedMedia"
              :key="indexv"
              class="w-full mb-base"
            >
              <div class="flex justify-between items-center">
                <!-- <vs-checkbox type="checkbox" color="danger" :value="media" v-model="selectedItems"></vs-checkbox> -->
                <h5 class="mb-3">Scene {{ indexv + 1 }}</h5>
                <div class="flex justify-end w-1/2">
                  <vx-tooltip text="Add Scene" class="w-1/3">
                    <vs-icon
                      icon="add"
                      size="20px"
                      class="cursor-pointer"
                      @click="addScene(indexv)"
                    />
                  </vx-tooltip>
                  <vx-tooltip text="Delete Scene">
                    <vs-icon
                      v-if="selectedItems.includes(media)"
                      icon="delete"
                      size="20px"
                      class="cursor-pointer"
                      @click="deleteScene(indexv)"
                    />
                  </vx-tooltip>
                  <vx-tooltip text="Check to delete multiple">
                    <input
                      class="checkbox"
                      type="checkbox"
                      :value="media"
                      v-model="selectedItems"
                    />
                  </vx-tooltip>
                </div>
              </div>
              <template v-if="media">
                <MediaPreview
                  v-if="isImageUrl(media.url)"
                  image
                  @click.native="scrollToScene(indexv)"
                  :src="media.url"
                />
                <MediaPreview
                  :src="media.url"
                  v-else
                  @click.native="scrollToScene(indexv)"
                />
              </template>
              <div
                v-else
                class="add-scene-container relative vs-con-loading__container"
                :id="`upload_scene_${indexv}`"
              >
                <VideoNotFound
                  :sceneNum="indexv"
                  @click.native="scrollToScene(indexv)"
                  @search="loadSearchModal($event)"
                />
              </div>
              <!-- <vx-tooltip text="Delete Scene">
                <vs-icon
                  v-if="selectedItems.includes(media)"
                  icon="delete"
                  size="20px"
                  class="cursor-pointer"
                  @click="deleteScene(indexv)"
                />
              </vx-tooltip> -->
            </div>
            <div class="w-full items-center">
              <vs-button icon="add" @click="addScene(selectedMedia.length)">
                {{ $t('ScenesPanel.add') }}
              </vs-button>
            </div>
          </component>
        </div>
      </div>
    </div>
    <SearchModal
      :showModal.sync="showSearchModal"
      :sceneNum="currentScene"
      @close="showSearchModal = false"
    />
  </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import SearchModal from '@/components/search/SearchModal';
import DeletedModal from '@/components/deleted-files/Model.vue'; //under development
import VideoNotFound from '@/components/VideoNotFound';
import MediaPreview from './components/MediaPreview';
// import DeletedFiles from "./"
// import CustomDropdown from './components/CustomDropdown';
import { utils } from '@/mixins/index.js';
import { media } from '@microsoft/teams-js';
export default {
  name: 'ScenesPanel',
  mixins: [utils],
  components: {
    VideoNotFound,
    SearchModal,
    MediaPreview,
    VuePerfectScrollbar,
    DeletedModal, //under development
    // CustomDropdown
  },
  data() {
    return {
      showModel: false, //under development
      showDeletedModel: false,
      showSearchModal: false,
      currentScene: null,
      pptImage: false,
      settings: {
        // perfectScrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 1,
        swipeEasing: true,
        scrollXMarginOffset: 100,
      },
      selectedItems: [], // Array to store selected images/videos
    };
  },
  computed: {
    selectedMedia() {
      return this.$store.state.studio.selectedFromLibraryMedia;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    sceneLength() {
      return Object.keys(this.$store.state.studio.scenes).length;
    },
  },
  methods: {
    loadSearchModal(index) {
      this.showSearchModal = true;
      this.currentScene = index;
    },
    prepareAllScenes() {
      /* this.$store.commit(
        'studio/setPrepareAllScenes',
        this.$store.state.studio.selectedFromLibraryVideos
      ); */
      this.$store.commit('studio/skipSubtitles');
      this.$store.commit('studio/toggleMusic');
    },
    addScene(index) {
      this.$store.commit('studio/addScene', index);
    },
    deleteScene(index) {
      if (this.selectedItems.length > 0) {
        // Check if there is only one item remaining
        if (this.selectedMedia.length === 1) {
          this.$vs.notify({
            title: 'Alert',
            text: 'Cannot delete the last scene',
            color: 'primary',
          });
          return; // Exit the function without deleting
        }
        // Check if all selected items are being deleted
        if (this.selectedItems.length === this.selectedMedia.length) {
          this.$vs.notify({
            title: 'Alert',
            text: 'At least one file should exist',
            color: 'primary',
          });
          return; // Exit the function without deleting
        }

        // Remove the selected scene from selectedMedia array
        this.selectedMedia.splice(index, 1);

        // Iterate over selected items and delete them
        this.selectedItems.forEach((item) => {
          const itemIndex = this.selectedMedia.indexOf(item);
          if (itemIndex !== -1) {
            this.selectedMedia.splice(itemIndex, 1);
          }
        });

        // Update session storage with deleted media
        const deletedMediaList =
          JSON.parse(sessionStorage.getItem('deletedMediaList')) || [];
        deletedMediaList.push(
          ...this.selectedItems.map((item, i) => ({
            index: index,
            id: item.id,
            url: item.url,
          }))
        );
        sessionStorage.setItem(
          'deletedMediaList',
          JSON.stringify(deletedMediaList)
        );

        // Clear the selected items array
        this.selectedItems = [];

        // Perform any additional cleanup or logic
      } else {
        this.$vs.notify({
          title: 'Alert',
          text: 'No items selected',
          color: 'primary',
        });
      }
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
.add-scene-container {
  width: 100%;
  height: 133px;
  display: flex;
  justify-content: center;
  background: #b9b9b9;
}
.image-frame {
  width: 100%;
  height: auto;
}
.scroll-area {
  position: relative;
  width: 100%;
  height: 60vh;
}

.trash-icon {
  /* margin-left: 1rem; */
}

.flex-button-div {
  display: flex;
}

.delete-icon-tooltip {
  display: inline;
}

.checkbox {
  margin-left: 1.1rem;
  margin-right: 0.5rem;
}
</style>
