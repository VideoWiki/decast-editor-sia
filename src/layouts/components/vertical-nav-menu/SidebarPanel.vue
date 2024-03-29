<template>
  <vs-row>
    <vs-col
      class="p-3"
      vs-type="flex"
      vs-justify="center"
      vs-align="center"
      vs-w="3"
      style="display: block"
    >
      <vs-row>
        <vs-col class="mb-2">
          <div
            class="vx-card"
            :class="{ selected: $store.state.studio.panel.text }"
            @click="toggleText"
          >
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body items-center">
                <vs-avatar color="primary" icon="text_fields" /><br />
                <span class="font-semibold">{{
                  $t('studio.sidebarPanel.sp1')
                }}</span>
              </div>
            </div>
          </div>
        </vs-col>
        <vs-col class="mb-2">
          <div
            class="vx-card"
            :class="{ selected: $store.state.studio.panel.library }"
            @click="toggleLibrary"
          >
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body items-center">
                <vs-avatar color="primary" icon="grid_on" /><br />
                <span class="font-semibold">{{
                  $t('studio.sidebarPanel.sp2')
                }}</span>
              </div>
            </div>
          </div>
        </vs-col>
        <vs-col class="mb-2">
          <div
            class="vx-card"
            :class="{ selected: $store.state.studio.panel.scenes }"
            @click="toggleScenes"
          >
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body items-center">
                <vs-avatar color="primary" icon="menu_book" /><br />
                <span class="font-semibold">{{
                  $t('studio.sidebarPanel.sp4')
                }}</span>
              </div>
            </div>
          </div>
        </vs-col>
        <vs-col class="mb-2">
          <div
            class="vx-card"
            :class="{ selected: $store.state.studio.panel.music }"
            @click="toggleMusic"
          >
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body items-center">
                <vs-avatar color="primary" icon="library_music" /><br />
                <span class="font-semibold">{{
                  $t('studio.sidebarPanel.sp5')
                }}</span>
              </div>
            </div>
          </div>
        </vs-col>
        <vs-col class="mb-2">
          <div
            class="vx-card"
            :class="{ selected: $store.state.studio.panel.storage }"
            @click="toggleStorage"
          >
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body items-center">
                <vs-avatar color="primary" icon="storage" /><br />
                <span class="font-semibold">{{
                  $t('studio.sidebarPanel.sp12')
                }}</span>
              </div>
            </div>
          </div>
        </vs-col>
        <vs-col class="mb-2">
          <div
            class="vx-card"
            :class="{ selected: $store.state.studio.panel.publish }"
            @click="togglePublish"
          >
            <div class="vx-card__collapsible-content vs-con-loading__container">
              <div class="vx-card__body items-center">
                <vs-avatar color="primary" icon="publish" /><br />
                <span class="font-semibold">{{
                  $t('studio.sidebarPanel.sp6')
                }}</span>
              </div>
            </div>
          </div>
        </vs-col>
      </vs-row>
    </vs-col>
    <vs-col
      class="p-3"
      vs-type="flex"
      vs-justify="center"
      vs-align="center"
      vs-w="9"
      style="display: block"
    >
      <TextPanel v-if="$store.state.studio.panel.text" />
      <LibraryPanel v-else-if="$store.state.studio.panel.library" />
      <ScenesPanel v-else-if="$store.state.studio.panel.scenes" />
      <MusicPanel v-else-if="$store.state.studio.panel.music" />
      <StylePanel v-else-if="$store.state.studio.panel.style" />
      <StoragePanel v-else-if="$store.state.studio.panel.store" />
      <component
        :is="scrollbarTag"
        ref="verticalNavMenuPs"
        class="scroll-area-v-nav-menu"
        :settings="settings"
        :key="$vs.rtl"
        v-else-if="$store.state.studio.panel.publish"
      >
        <PublishPanel />
      </component>
    </vs-col>
  </vs-row>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import TextPanel from './PanelItems/TextPanel.vue';
import StylePanel from './PanelItems/StylePanel';
import LibraryPanel from './PanelItems/LibraryPanel';
import MusicPanel from './PanelItems/MusicPanel';
import ScenesPanel from './PanelItems/ScenesPanel';
import PublishPanel from './PanelItems/PublishPanel';
import StoragePanel from './PanelItems/StoragePanel';
export default {
  name: 'SidebarPanel',
  components: {
    PublishPanel,
    ScenesPanel,
    MusicPanel,
    LibraryPanel,
    StylePanel,
    TextPanel,
    StoragePanel,
    VuePerfectScrollbar,
  },
  data() {
    return {
      settings: {
        // perfectScrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 1,
        swipeEasing: true,
      },
    };
  },
  computed: {
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    notifyText(id) {
      if (this.clicked) {
        return;
      }
      this.clicked = true;
      this.$vs.notify({
        color: 'primary',
        // title: 'Cannot',
        text: this.$t(`studio.sidebarPanel.sp${id}`),
      });
      setTimeout(() => {
        this.clicked = false;
      }, 2900);
    },
    isLibraryEmpty() {
      if (Object.keys(this.$store.state.studio.videos).length === 0) {
        return true;
      } else {
        return false;
      }
    },
    isToggleStyleEmpty() {
      if (Object.keys(this.$store.state.studio.videos).length === 0) {
        this.toggleText();
        return true;
      } else {
        this.$store.commit('studio/toggleStyle');
        return false;
      }
    },
    isToggleScenesEmpty() {
      if (
        this.$store.state.studio.selectedFromLibraryMedia.some(
          (el) => !el || !el.url
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    isToggleMusicEmpty() {
      if (
        !this.$store.state.studio.skipSubtitles &&
        this.$store.state.studio.preparedScenesVideos.every((el) => !el)
      ) {
        return true;
      } else {
        return false;
      }
    },
    toggleStorage() {
      console.log('Hello');
      this.$store.commit('studio/toggleStorage');
    },
    togglePublish() {
      if (
        !this.$store.state.studio.video.bg_music.url &&
        !this.$store.state.studio.skipMusic &&
        this.$store.state.studio.addedAudioVideos.every((el) => !el)
      ) {
        return true;
      } else {
        return false;
      }
    },
    toggleText() {
      this.$store.commit('studio/toggleText');
    },
    toggleLibrary() {
      if (this.isLibraryEmpty()) {
        this.toggleText();
        this.notifyText(7);
      } else {
        this.$store.commit('studio/toggleLibrary');
      }
    },
    toggleStyle() {
      if (this.isLibraryEmpty()) {
        this.notifyText(7);
      } else {
        this.$store.commit('studio/toggleStyle');
      }
    },
    toggleScenes() {
      if (this.isLibraryEmpty()) {
        this.notifyText(7);
      } else if (this.isToggleScenesEmpty()) {
        this.notifyText(8);
      } else {
        this.$store.commit('studio/toggleScenes');
      }
    },
    toggleMusic() {
      if (this.isLibraryEmpty()) {
        this.notifyText(7);
      } else if (this.isToggleScenesEmpty()) {
        this.notifyText(8);
      } else if (this.isToggleMusicEmpty()) {
        this.notifyText(10);
      } else {
        this.$store.commit('studio/toggleMusic');
      }
    },
    togglePublish() {
      if (this.isLibraryEmpty()) {
        this.notifyText(7);
      } else if (this.isToggleScenesEmpty()) {
        this.notifyText(8);
      } else if (this.isToggleMusicEmpty()) {
        this.notifyText(10);
      } else {
        this.$store.commit('studio/togglePublish');
      }
    },
  },
};
</script>

<style scoped>
.vx-card {
  cursor: pointer;
}

.vx-card > .vx-card__collapsible-content > .vx-card__body {
  padding: 0.8rem !important;
}

.vx-card > .vx-card__collapsible-content {
  transition: none;
}

.selected {
  color: white;
  background: #7367f0;
}

.items-center {
  text-align: center;
  text-align: -moz-center;
  text-align: -webkit-center;
}

.scroll-area-v-nav-menu {
  position: relative;
  margin: auto;
  width: 100%;
  height: calc(var(--vh, 1vh) * 100 - 69px);
}
</style>
