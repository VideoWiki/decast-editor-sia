<template>
  <div>
    <TheHeader />
    <div
      class="vs-con-loading__container"
      id="div-with-loading"
      :class="{ 'h-72': isLoading }"
    ></div>
    <div v-if="!isLoading">
      <template v-if="videoList.length > 0">
        <vs-row>
          <template v-for="video in videoList">
            <vs-col
              :key="video.id"
              class="p-3 lg:w-1/5 md:w-1/3 sm:w-1/2 w-full"
            >
              <VideoCard
                :prop="video"
                type="published"
                :isUser="false"
                @click.native="detailView(video)"
              />
            </vs-col>
          </template>
        </vs-row>
        <div class="w-7/12 mt-8 pb-8">
          <vs-pagination
            :total="pageCount"
            v-model="current"
            prev-icon="arrow_back"
            :max="Max"
            @input="changed"
            color="#7246c5"
            ref="pagination"
            next-icon="arrow_forward"
          ></vs-pagination>
        </div>
      </template>
      <template v-else>
        <div class="flex h-72 justify-center items-center flex-wrap">
          <h4 class="text-danger">No videos published yet</h4>
        </div>
      </template>
    </div>
    <vs-popup ref="custom_modal" :active.sync="showAssetModal">
      <div class="flex items-start -m-5">
        <div class="p-5">
          <img src="@/assets/images/pages/mp4.svg" />
        </div>
        <div class="p-5">
          <div class="mb-2">
            <h4>{{ selectedVideo.video ? selectedVideo.video.title : '' }}</h4>
          </div>
          <div>
            <div class="vs-con-loading__container" id="buy-download">
              <div v-if="!isDownloadable">
                <div class="mb-2">
                  <b>{{ oceanRequired }}</b> OCEAN
                </div>
                <vs-button
                  type="filled"
                  class="mb-2 font-semibold px-12"
                  @click="buyContent"
                  >Buy</vs-button
                >
                <vs-button type="filled" class="font-semibold mt-2">
                  <a target="_blank" class="text-white" :href="previewUrl">
                    Preview
                  </a>
                </vs-button>
              </div>
              <div v-else>
                <vs-button
                  type="filled"
                  class="font-semibold"
                  @click="downloadAsset"
                  >Download</vs-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--vs-divider /-->
    </vs-popup>
    <Transaction
      :show="showTransactionModal"
      :transactionType="txType"
      :transactionPhase="currentTxPhase"
      @close="showTransactionModal = false"
      @retry="txType === 'Buy' ? buyContent() : downloadAsset()"
    />
    <a href="" ref="link" target="_blank" class="hidden"></a>
  </div>
</template>
<script>
import TheHeader from '@/layouts/components/navbar/NavbarDashboard';
import Transaction from '@/views/components/Transaction/Transaction.vue';
import VideoCard from './components/VideoCard';
import { ajaxCallMixin } from '../../http/HttpCommon';
import networks from '../pages/networks';
import axios from '../../axios';
export default {
  name: 'Dashboard',
  mixins: [ajaxCallMixin],
  components: {
    TheHeader,
    VideoCard,
    Transaction,
  },
  data() {
    return {
      videoList: [],
      isLoading: false,
      selectedVideo: {},
      current: 1,
      oceanRequired: 0,
      showAssetModal: false,
      videoTxData: {},
      isDownloadable: false,
      showTransactionModal: false,
      txType: 'Buy',
      currentTxPhase: 'Processing',
      dataToken: '',
      videoTitle: '',
      videoDescription: '',
      previewUrl: '',
      pageCount: 1,
      Max: 1,
    };
  },
  computed: {
    usersData() {
      return this.$store.state.AppActiveUser;
    },
    reversedVideoList() {
      return this.videoList.slice().reverse();
    },
    isWalletConnected() {
      return this.$store.state.isWalletConnected;
    },
    accountAddress() {
      return this.$store.state.accountAddress;
    },
  },
  mounted() {
    this.getVideoList();
    this.$refs.custom_modal.$el.childNodes[1].childNodes[0].style.display =
      'none';
    this.$refs.custom_modal.$el.childNodes[1].style.width = '400px';
  },
  methods: {
    changed() {
      const url = '/api/home_videos/?page=' + this.current;
      this.$vs.loading({
        background: 'transparent',
        container: '#div-with-loading',
      });
      this.getRequest(url, this.changePage);
    },
    changePage(apiResponse) {
      this.videoList = apiResponse.results;
    },
    getVideoList() {
      const url = '/api/home_videos/';
      this.$vs.loading({
        background: 'transparent',
        container: '#div-with-loading',
      });
      this.isLoading = true;
      this.getRequest(url, this.handleResponse);
    },
    handleResponse(apiResponse) {
      this.$vs.loading.close('#div-with-loading > .con-vs-loading');
      this.isLoading = false;
      this.videoList = apiResponse.results;
      setTimeout(() => {
        console.log(this.$refs['pagination']);
        delete this.$refs['pagination'].$children[0].$children[0];
      }, 1000);
      if (apiResponse.count % 15) {
        this.pageCount = Math.floor(apiResponse.count / 15) + 1;
      } else {
        this.pageCount = Math.floor(apiResponse.count / 15);
      }
      if (this.pageCount < 9) {
        this.Max = this.pageCount;
      } else {
        this.Max = 9;
      }
      console.log(this.Max);
    },
    async switchNetwork(id) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: networks[id].chainId }],
        });
      } catch (error) {
        if (error.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: networks[id].chainId,
                  chainName: networks[id].chainName,
                  rpcUrls: [networks[id].rpcUrl],
                  nativeCurrency: {
                    name: networks[id].currencyName,
                    symbol: networks[id].symbol,
                    decimals: 18,
                  },
                  blockExplorerUrls: [networks[id].blockExplorerUrl],
                },
              ],
            });
          } catch (error) {
            alert(error.message);
          }
        }
      }
    },
    detailView(selectedVideo) {
      if (selectedVideo.is_paid) {
        this.showAssetModal = true;
        this.selectedVideo = selectedVideo;
        if (!this.isWalletConnected) {
          this.getVideoTxData();
        }
      } else {
        const route = this.$router.resolve({
          name: 'Video View',
          params: { slug: selectedVideo.id },
          query: { url: selectedVideo.video.url },
        });
        window.open(route.href, '_blank');
      }
    },
    async buyContent() {
      this.showAssetModal = false;
      this.txType = 'Buy';
      this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 1);
      this.showTransactionModal = true;
      this.currentTxPhase = 'Processing';
      if (this.videoTxData.dataToken === 'none') {
        await this.switchNetwork(80001);
        await this.$store.dispatch('purchase', {
          tokenId: this.videoTxData.dod,
          type: 'none',
        });
        this.showTransactionModal = false;
        return;
      } else if (this.videoTxData.dataToken === 'filebase') {
        await this.switchNetwork(3141);
        await this.$store.dispatch('purchase', {
          tokenId: this.videoTxData.dod,
          type: 'filebase',
        });
        this.showTransactionModal = false;
        return;
      }
      try {
        await this.switchNetwork(5);
        await this.$store.dispatch(
          'initiateBuy',
          this.videoTxData.exchange_key
        );
        this.isDownloadable = await this.$store.dispatch('getDownloadStatus', {
          did: this.videoTxData.dod,
          accountAddress: this.accountAddress,
        });
        this.showTransactionModal = false;
        // this.detailView(this.selectedVideo);
      } catch (error) {
        if (error.code === 4001) this.currentTxPhase = 'Rejected';
        else this.currentTxPhase = 'Failed';
      }
    },
    async downloadAsset() {
      this.showAssetModal = false;
      this.txType = 'Download';
      this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 1);
      try {
        if (this.videoTxData.dataToken === 'none') {
          await this.switchNetwork(80001);
          const uri = await this.$store.dispatch('tokenuri', {
            tokenId: this.videoTxData.dod,
            type: 'none',
          });
          fetch(uri + 'metadata.json')
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              this.$refs.link.setAttribute('href', data.url);
              console.log(this.$refs.link);

              this.$refs.link.click();
            });
          return;
        } else if (this.videoTxData.dataToken === 'swarm') {
          const payload = {
            pod: this.usersData.id,
            path: `/${this.usersData.id}${this.videoTxData.dod}`,
          };
          console.log(payload);
          this.txType = 'swarmDownload';
          this.showTransactionModal = true;
          try {
            await this.$store.dispatch('login', this.usersData.id);
            const download = await this.$store.dispatch(
              'swarmDownload',
              payload
            );
            console.log(download);
            this.getStatus(download.task_id);
          } catch (e) {
            this.currentTxPhase = 'Failed';
          }

          // Convert the combined Base64 string back to binary data
        } else if (this.videoTxData.dataToken === 'filebase') {
          await this.switchNetwork(3141);
          const uri = await this.$store.dispatch('tokenuri', {
            tokenId: this.videoTxData.dod,
            type: 'filebase',
          });
          fetch(uri + 'metadata.json')
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              this.$refs.link.setAttribute('href', data.url);
              console.log(this.$refs.link);

              this.$refs.link.click();
            });
          return;
        } else if (this.videoTxData.dataToken === 'sia') {
          console.log('isa');
          this.downloadFromSia();
        } else {
          await this.switchNetwork(5);
          this.showTransactionModal = true;
          this.currentTxPhase = 'Processing';
          await this.$store.dispatch('startDownload', {
            did: this.videoTxData.dod,
            dta: this.videoTxData.dataToken,
          });
          setTimeout(() => (this.showTransactionModal = false), 2000);
        }
      } catch (error) {
        if (error.code === 4001) this.currentTxPhase = 'Rejected';
        else this.currentTxPhase = 'Failed';
      }
    },
    async getStatus(taskId) {
      try {
        const response = await this.$store.dispatch(
          'swarmDownloadStatus',
          taskId
        );
        if (response.data.file_content_base64) {
          const url = `data:video/webm;base64,${response.data.file_content_base64.trim()}`; // getting base64 string and converting it to data url
          const a = document.createElement('a');
          a.href = url;
          a.download = this.videoTxData.dod.slice(
            1,
            this.videoTxData.dod.length
          ); // Set the desired file name
          this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 2);
          a.style.display = 'none';
          a.click(); // You can specify the desired filename here
          this.showTransactionModal = false;
        } else {
          console.log(response, 'res');
          setTimeout(() => this.getStatus(taskId), 5000);
        }
      } catch (e) {
        console.log(e.response);
      }
    },
    getVideoTxData() {
      console.log('dsadf');
      console.log(this.selectedVideo.published_id);
      const url = `/transaction/oceanbuy?video_id=${this.selectedVideo.published_id}`;
      this.$vs.loading({
        container: `#buy-download`,
        background: '#fff',
        color: 'primary',
        scale: 0.8,
      });
      this.getRequest(url, this.callBackVideoTxData);
    },
    async callBackVideoTxData(apiResponse) {
      this.videoTxData = apiResponse.data;
      console.log(this.videoTxData);
      this.previewUrl =
        'https://player.video.wiki/player?url=' +
        this.videoTxData.ipfs_preview_url;
      if (this.videoTxData.dataToken === 'none') {
        await this.switchNetwork(80001);
        this.isDownloadable = await this.$store.dispatch('ownerOf', {
          tokenId: this.videoTxData.dod,
          walletAddress: this.accountAddress,
          type: 'none',
        });
      } else if (this.videoTxData.dataToken === 'filebase') {
        await this.switchNetwork(3141);
        this.isDownloadable = await this.$store.dispatch('ownerOf', {
          tokenId: this.videoTxData.dod,
          walletAddress: this.accountAddress,
          type: 'filebase',
        });
      } else if (this.videoTxData.dataToken === 'swarm'  || this.videoTxData.dataToken === 'sia') {
        this.isDownloadable = true;
      } else {
        // const price = await this.$store.dispatch(
        //   'getAssetPrice',
        //   this.videoTxData.exchange_key
        // );
        await this.switchNetwork(5);
        this.isDownloadable = await this.$store.dispatch('getDownloadStatus', {
          did: this.videoTxData.dod,
          accountAddress: this.accountAddress,
        });
      }
      if (this.isDownloadable) {
        console.log(this.selectedVideo.published_id);
        var URL = `/api/video_details?published_id=${this.selectedVideo.published_id}`;
        this.getRequest(URL, this.callBackInfo);
        return;
      }
      this.$vs.loading.close(`#buy-download > .con-vs-loading`);
      this.oceanRequired = price;
    },
    async downloadFromSia() {
      console.log('down call');
      try {
        this.$vs.loading();
        const fileName = this.videoTxData.dod.split('/').pop();

        const response = await axios.get(
          `https://api.storage.video.wiki/api/sia/download/?file_name=${fileName}`,
          { responseType: 'blob' }
        );

        const blob = new Blob([response.data]);
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$vs.loading.close();
        this.$vs.notify({
          title: 'Download Complete',
          text: 'File has been downloaded successfully.',
          color: 'success',
        });
      } catch (error) {
        this.$vs.loading.close();
        console.error('Error downloading file from Sia', error);
        this.$vs.notify({
          title: 'Download Error',
          text: 'An error occurred while downloading the file from Sia.',
          color: 'danger',
        });
      }
    },
    callBackInfo(apiResponse) {
      this.videoTitle =
        apiResponse.data.title.length > 70
          ? apiResponse.data.title.slice(0, 279) + '...'
          : apiResponse.data.title;
      this.videoDescription =
        apiResponse.data.description.length > 300
          ? apiResponse.data.description.slice(0, 279) + '...'
          : apiResponse.data.description;
      console.log(this.videoDescription, this.videoTitle);
      this.$vs.loading.close(`#buy-download > .con-vs-loading`);
    },
  },
};
</script>
<style scoped>
.iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 60%;
  width: 50%;
  transform: translate(-50%, -50%);
}
</style>
