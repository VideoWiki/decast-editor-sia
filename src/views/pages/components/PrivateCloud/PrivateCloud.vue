<template>
  <div class="main">
    <div class="heading">Private Cloud</div>
    <div class="sub-heading">Connect your private cloud to upload a video</div>
    <!-- <div
      class="boxes first-box"
      :style="{
        height: toggleValue1 ? '368px' : '76px',
        boxShadow: toggleValue1 ? '0px 20px 20px 0px #7966FA1A;' : '',
      }"
    >
      <div class="without-popup flex">
        <div class="left-side flex">
          <img src="@/assets/images/editor/first.svg" alt="" />
          <p class="text">Amazon AWS</p>
        </div>
        <div class="toggle-button">
          <ToggleButton v-model="toggleValue1" />
        </div>
      </div>
      <div v-if="toggleValue1" class="pop-up">
        <div class="horizontal-line"></div>
        <div class="buttom-side flex">
          <div class="left-part flex">
            <div class="input-boxes">
              <div class="input-text">Location:</div>
              <input type="text" placeholder="s3.amazonaws.com" />
            </div>
            <div class="input-boxes">
              <div class="input-text">Secret Key:</div>
              <input type="text" />
            </div>
            <div class="input-boxes">
              <div class="input-text">Destination:</div>
              <input type="text" />
            </div>
          </div>
          <div class="right-part flex">
            <div class="input-boxes">
              <div class="input-text">Access Key:</div>
              <input type="text" />
            </div>
            <div class="input-boxes">
              <div class="input-text">Bucket Name:</div>
              <input type="text" />
            </div>
          </div>
        </div>
        <div class="button">
          <button class="cursor-pointer">Save</button>
        </div>
      </div>
    </div> -->

    <div
      class="boxes second-box"
      :style="{
        height: toggleValue2 ? 'auto' : '76px',
        boxShadow: toggleValue2 ? '0px 20px 20px 0px #7966FA1A;' : '',
      }"
    >
      <div class="without-popup flex">
        <div class="left-side flex">
          <img src="@/assets/images/editor/azure1.svg" alt="" />
          <p class="text">Microsoft Azure</p>
        </div>
        <div class="toggle-button">
          <ToggleButton v-model="toggleValue2" />
        </div>
      </div>
      <div v-if="toggleValue2" class="pop-up">
        <div class="horizontal-line"></div>
        <div class="buttom-side ">
          <div class="left-part-2 flex">
            <div class="input-boxes">
              <div class="input-text">Account Name:</div>
              <input
                type="text"
                v-model="account"
                placeholder="s3.amazonaws.com"
              />
            </div>
            <div class="input-boxes">
              <div class="input-text">Container Name:</div>
              <input type="text" v-model="container" />
            </div>
          </div>
          <div class="right-part-2 flex">
            <div class="input-boxes">
              <div class="input-text">Access Key:</div>
              <input type="password" v-model="key" />
            </div>
            <div class="input-boxes">
              <div class="input-text">Endpoint Suffix:</div>
              <input type="text" v-model="endPoint" />
            </div>
          </div>
        </div>
        <div class="button">
          <button class="cursor-pointer" @click="save">Save</button>
        </div>
      </div>
    </div>
    <!-- <div class="boxes third-box flex">
      <div class="left-side flex">
        <img src="@/assets/images/editor/google-drive1.svg" alt="" />
        <p class="text">Google Drive</p>
      </div>
      <div class="toggle-button">
        <ToggleButton v-model="toggleValue3" />
      </div>
    </div> -->
  </div>
</template>
<script>
import ToggleButton from './ToggleButton.vue';
export default {
  name: 'PrivateCloud',
  components: {
    ToggleButton,
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
  data() {
    return {
      toggleValue1: false,
      toggleValue2: true,
      toggleValue3: false,
      container: '',
      account: '',
      endPoint: '',
      key: '',
    };
  },
  methods: {
    save() {
      this.$vs.loading();
      const payload = {
        file: this.videoData.url,
        container: this.container,
        connectSTr: `DefaultEndpointsProtocol=https;AccountName=${this.account};AccountKey=${this.key};EndpointSuffix=${this.endPoint}`,
      };
      this.$store
        .dispatch('studio/uploadToCloud', payload)
        .then((res) => {
          console.log('response', res);
          this.checkStatus(res.task_id);
        })
        .catch((e) => {
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Error',
            text: 'try again',
            color: 'danger',
          });
        });
    },
    checkStatus(taskId) {
      this.$store
        .dispatch('studio/checkStatus', taskId)
        .then((res) => {
          if (res.status === 'SUCCESS') {
            var urls = JSON.parse(localStorage.getItem('urls'));
            this.$vs.loading.close();
            if (urls) {
              urls.push(res.file_url);
            } else {
              urls = [res.file_url];
            }

            localStorage.setItem('urls', JSON.stringify(urls));
            this.$vs.notify({
              title: 'Success',
              text: 'video uploaded to your Azure server',
              color: 'success',
            });
          } else {
            setTimeout(() => this.checkStatus(taskId), 5000);
          }
        })
        .catch((e) => {
          this.$vs.loading.close();

          alert('error occured');
        });
    },
  },
};
</script>
<style scoped>
.main {
  height: 110vh;
  padding: 50px;
  background-color: #ffffff;
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
.first-box {
  margin-top: 40px;
}
.boxes {
  /* width: 764px; */
  height: 76px;
  border: 1px solid #eaecf0;
  border-radius: 8px;
  align-items: center;
  justify-content: space-between;
  transition: height 0.4s;
  padding: 22px;
}
.third-box,
.second-box {
  margin-top: 30px;
}
.left-side {
  align-items: center;
}
.left-side img {
  height: 32px;
  width: 32px;
}
.text {
  margin-left: 32px;
  font-weight: 600;
  font-size: 18px;
  color: #667085;
}
.without-popup {
  justify-content: space-between;
}
.pop-up {
  display: flex;
  flex-direction: column;
}
.horizontal-line {
  margin-top: 30px;
  border: 1px solid #eaecf0;
}
.buttom-side {
  margin-top: 30px;
  justify-content: space-between;
}
@media (min-width: 1440px) {
  .buttom-side{
    display: flex;
  }
}
.left-part {
  height: 160px;
  flex-direction: column;
  justify-content: space-around;
}
.left-part-2 {
  height: 160px;
  flex-direction: column;
  justify-content: space-around;
}
.input-boxes {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.input-text {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
}
.input-boxes input {
  height: 40px;
  width: auto;
  max-width: 181px;
  border: 1px solid #bdbdbd;
  padding: 8px 10px 8px 10px;
  border-radius: 8px;
}
.right-part {
  height: 108px;
  flex-direction: column;
  justify-content: space-around;
}
.right-part-2 {
  height: 160px;
  flex-direction: column;
  justify-content: space-around;
}
.button {
  margin-top: 30px;
  align-self: flex-end;
}
.button button {
  width: 123px;
  height: 42px;
  background-color: #7966fa;
  border: none;
  border-radius: 60px;
  padding: 10px 40px 10px 40px;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
}

@media (max-width: 1440px){
  .button {
    margin: auto;
    margin-top: 30px;
    display: flex;
    justify-content: center;
  }
  .button button {
    width: 123px; 
    padding: 10px 20px; 
  }
}
</style>
