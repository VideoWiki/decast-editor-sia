<template lang="html">
  <div class="centerx">
    <vs-button @click="popupActivo2 = true" color="" type="filled"
      >  <vs-icon class="feather" icon-pack="feather" icon="icon-trash-2" size="30px" /></vs-button
    >
    <vs-popup
      classContent="popup-example"
      title="Restore deleted files"
      :active.sync="popupActivo2"
    >
      <div class="grid-container">
        <div
          v-for="(file, index) in getStoredFiles()"
          :key="index"
          class="grid-item"
          @click="openConfirmationPopup(file, index)"
        >
          <MediaPreview class="" :src="file.url" />
        </div>
      </div>
      <vs-popup title="" :active.sync="popupActivo3">
        <p class="confirmation-text">Do you want to restore this file?</p>
        <div class="button-box">
        <vs-button
          color="primary"
          type="filled"
          @click="deleteFile(selectedFile, selectedIndex)"
          >Restore</vs-button
        >
        <vs-button color="danger" type="border" @click="cancelFileDeletion"
          >Cancel</vs-button
        >
        </div>
      </vs-popup>
    </vs-popup>
  </div>
</template>

<script>
import MediaPreview from '@/layouts/components/vertical-nav-menu/PanelItems/components/MediaPreview.vue';

export default {
  components: {
    MediaPreview,
  },
  data() {
    return {
      popupActivo2: false,
      popupActivo3: false,
      storedFiles: [],
      selectedFile: null,
      selectedIndex: -1,
    };
  },
  mounted() {
    this.storedFiles = this.getStoredFiles();
  },
  methods: {
    getStoredFiles() {
      const deletedMediaList = sessionStorage.getItem('deletedMediaList');
      return JSON.parse(deletedMediaList) || [];
    },
    openConfirmationPopup(file, index) {
      this.selectedFile = file;
      this.selectedIndex = index;
      this.popupActivo3 = true;
    },
    deleteFile(file, index) {
      console.log(`Deleting file: ${file.url}`);
      this.storedFiles.splice(index, 1); // Remove the file from the stored files array

      sessionStorage.setItem(
        'deletedMediaList',
        JSON.stringify(this.storedFiles)
      );
      console.log(`File removed from session storage: ${file.url}`);
      // Perform additional deletion actions if needed

      // Implement restore logic here
      this.$store.commit('studio/restoreDeletedFile', file);

      this.popupActivo3 = false;
    },
    cancelFileDeletion() {
      console.log('File deletion cancelled');
      this.popupActivo3 = false;
    },
  },
};
</script>

<style lang="stylus" scoped>
.popup-example
  .vs-input
    float: left
    width: 50%
    margin: 10px
    margin-top: 5px
  .con-select
    margin-left: 10px
    width: 50%
    margin-bottom: 10px

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.confirmation-text{
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
}

.button-box{
  display: flex;
  justify-content: space-around;
}

.feather{
  background-color: white;
  color: #7367F0;
}

.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
