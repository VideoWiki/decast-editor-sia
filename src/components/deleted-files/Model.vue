<template>
  <div class="centerx">
    <!-- <vs-button
      @click="popupActivo = true"
      color="primary"
      class="vs-icon"
      type="flat"
    >
      <vs-icon icon-pack="feather" icon="icon-trash-2" size="30px" />
    </vs-button> -->
    <vs-popup
      class="holamundo"
      title="Deleted files"
      :active.sync="popupActivo"
    >
      <div class="grid-container">
        <div
          v-for="(file, index) in getDeletedFiles()"
          :key="index"
          class="grid-item"
          @click="openConfirmationPopup(file, index)"
        >
          <MediaPreview class="" :src="file.url" />
        </div>
      </div>
      <vs-popup
        v-if="showConfirmationPopup"
        title="Confirmation"
        :active.sync="popupConfirmationActive"
      >
        <p>Do you want to restore this file?</p>
        <vs-button
          color="primary"
          type="filled"
          @click="restoreFile(selectedFile, selectedIndex)"
          >Restore</vs-button
        >
        <vs-button
          color="danger"
          type="filled"
          @click="cancelFileRestoring(selectedFile, selectedIndex)"
          >Cancel</vs-button
        >
      </vs-popup>
    </vs-popup>
    <ConfimationVue />
  </div>
</template>

<script>
import MediaPreview from '@/layouts/components/vertical-nav-menu/PanelItems/components/MediaPreview.vue';
import ConfimationVue from './Confimation.vue';
export default {
  components: {
    MediaPreview,
    ConfimationVue,
  },
  data() {
    return {
      popupActivo: false,
      deletedFiles: [],
      showConfirmationPopup: false,
      popupConfirmationActive: false,
      selectedFile: null,
      selectedIndex: -1,
    };
  },
  mounted() {
    this.deletedFiles = this.getDeletedFiles();
  },
  methods: {
    openConfirmationPopup(file, index) {
      console.log(file);
      this.selectedFile = file;
      this.selectedIndex = index;
      this.showConfirmationPopup = true;
      this.popupConfirmationActive = true;
    },
    restoreFile(file, index) {
      console.log(`${file.url} is to be restored`);
      this.deletedFiles.splice(index, 1); // Remove the file from the deleted files array
      sessionStorage.setItem(
        'deletedMediaList',
        JSON.stringify(this.deletedFiles)
      );
      console.log(`File removed from session storage: ${file.url}`);
      this.$store.commit('studio/restoreDeletedFile', file);
      this.showConfirmationPopup = false;
      this.popupConfirmationActive = false;
    },
    cancelFileRestoring(file, index) {
      console.log('The file is not restored');
      this.showConfirmationPopup = false;
      this.popupConfirmationActive = false;
    },
    getDeletedFiles() {
      const deletedMediaList = sessionStorage.getItem('deletedMediaList');
      return JSON.parse(deletedMediaList) || [];
    },
  },
};
</script>

<style scoped>
.vs-icon {
  margin-left: 1rem;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
}

.media-preview {
  max-width: 500px;
}

/* Set a higher z-index for the confirmation popup */
.vs-popup.holamundo.vs-popup-active
  > .vs-popup--content.vs-popup-content
  > .vs-popup--box {
  z-index: 99999;
}
</style>
