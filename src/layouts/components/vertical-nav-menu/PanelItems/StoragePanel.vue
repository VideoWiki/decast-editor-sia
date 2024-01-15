<template>
  <div class="vx-card" style="height: 100%">
    <div class="vx-card__collapsible-content vs-con-loading__container">
      <div class="vx-card__body">
        <div>
          <h3 class="top-head">Storage Options</h3>
          <div class="storage-options mt-16">
            <div
              v-for="(option, index) in storageOptions"
              :key="index"
              :class="[
                'option-container',
                'flex',
                'p-3',
                'mt-5',
                { 'selected-option': option.selected },
              ]"
              @click="selectOption(option)"
            >
              <button class="storage-buttons">
                <img
                  :src="getIconPath(option.icon)"
                  :class="{ 'selected-icon': option.selected }"
                />
              </button>
              <span
                class="button-heading ml-3 m-auto"
                :style="{ color: option.selected ? '#FFFFFF' : null }"
                >{{ option.label }}</span
              >
            </div>
          </div>

          <!-- <div
          class="request-container flex p-3 mb-2"
          :class="{ 'selected-request': isRequestSelected }"
          @click="toggleRequestSelection"
        >
          <button class="storage-buttons">
            <img src="@/assets/images/storage-icons/send.svg" />
          </button>
          <span class="request-heading ml-3 m-auto">{{ requestLabel }}</span>
        </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoragePanel',
  data() {
    return {
      isRequestSelected: false,
      storageOptions: [
        {
          label: 'Local Disk',
          icon: 'blockchain.svg',
          selected: true,
          action: this.performLocalDiskAction,
        },
        {
          label: 'Public Cloud',
          icon: 'hard-disc.svg',
          selected: false,
          action: this.performPublicCloudAction,
        },
        {
          label: 'Private Cloud',
          icon: 'Secure.svg',
          selected: false,
          action: this.performPrivateCloudAction,
        },
        {
          label: 'Decentralized',
          icon: 'upload.svg',
          selected: false,
          action: this.performDecentralizedAction,
        },
      ],
      requestLabel: 'Request additional storage option',
    };
  },
  computed: {
    tabIndex() {
      return this.$store.state.studio.tabIndex;
    },
  },
  mounted() {
    this.$store.commit('studio/SET_TAB_INDEX', 1);
  },
  methods: {
    selectOption(option) {
      this.storageOptions.forEach((opt) => {
        opt.selected = false;
      });
      option.selected = true;
      option.action();
    },
    toggleRequestSelection() {
      this.isRequestSelected = !this.isRequestSelected;
      console.log('Request clicked');
    },
    getIconPath(iconName) {
      return require(`@/assets/images/storage-icons/${iconName}`);
    },
    performLocalDiskAction() {
      // Implement logic for the Local Disk action
      console.log('A clicked');
      this.$store.commit('studio/SET_TAB_INDEX', 1);
    },
    performPublicCloudAction() {
      // Implement logic for the Public Cloud action
      console.log('B clicked');
      this.$store.commit('studio/SET_TAB_INDEX', 2);
    },
    performPrivateCloudAction() {
      // Implement logic for the Private Cloud action
      console.log('C clicked');
      this.$store.commit('studio/SET_TAB_INDEX', 3);
    },
    performDecentralizedAction() {
      // Implement logic for the Decentralized action
      console.log('D clicked');
      this.$store.commit('studio/SET_TAB_INDEX', 0);
    },
    requestStorageOption() {
      // Implement logic for the Request Storage Option action
      console.log('D clicked');
    },
  },
};
</script>

<style>
.top-head {
  font-weight: 700;
  font: bolder;
  font-size: 16px;
  line-height: 20px;
  letter-spacing: 0.24px;
}

.storage-panel {
  background-color: #eef0f5;
  color: #d0d5dd;
  padding: 30px;
  height: 100%;
  z-index: 5;
  top: 0;
  left: 100px;
  position: absolute;
}

.storage-buttons {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background-color: #ffffff;
  border: 1px solid #d0d5dd;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-heading {
  color: #667085;
  font-weight: 600;
  font-size: 18px;
  line-height: 21.78px;
}

.request-heading {
  color: #667085;
  font-weight: 600;
  font-size: 16px;
  line-height: 19.36px;
}

.option-container {
  background-color: #f2f1f1;
  justify-content: left;
  border-radius: 8px;
  height: 76px;
}

.option-container:focus {
  background-color: #7966fa;
}

.request-container {
  bottom: 5px;
  position: absolute;
  background-color: #ffffff;
  justify-content: left;
  border-radius: 8px;
  margin: auto;
  height: 76px;
  cursor: pointer;
}

.selected-option {
  background-color: #7966fa;
}

.selected-icon {
  fill: #7966fa;
}

.selected-request {
  background-color: #7966fa;
}

.selected-request .storage-buttons {
  border-color: #7966fa;
}

.selected-request .request-heading {
  color: #ffffff;
}
</style>
