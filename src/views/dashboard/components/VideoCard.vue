<template>
  <vx-card class="video-card-inner cursor-pointer">
    <div slot="no-body" class="relative">
      <img
        :src="prop.video.thumbnail"
        @error="$event.target.src = defaultImg"
        alt="Not Found"
        class="h-48"
        width="100%"
      />
      <vs-chip class="video-length">{{ prop.video.duration }}</vs-chip>
    </div>
    <div class="card-body">
      <div
        v-if="type === 'published'"
        class="flex items-center justify-between mb-3"
      >
        <vs-row vs-type="flex" vs-align="center">
          <vs-button
            class="pl-3 text-xs fork-btn"
            size="small"
            @click.stop="forkVideo"
          >
            <span class="text-custom-purple ml-3">Fork it!</span>
          </vs-button>
          <img src="@/assets/images/pages/git-branch.png" class="branch-icon" />
        </vs-row>
        <vs-icon
          v-if="prop.is_paid"
          icon="lock"
          size="24px"
          color="primary"
          class="px-4"
        />
      </div>
      <div v-else>
        <vs-button
          type="filled"
          size="small"
          class="mb-1"
          @click.stop="editVideo"
          >Edit
        </vs-button>
      </div>
      <div
        class="mb-2 text-sm font-semibold"
        :title="
          prop.video.title === '' ? 'Video has no title' : prop.video.title
        "
      >
        <p class="line-clamp">
          {{
            prop.video.title === '' ? 'Video has no title' : prop.video.title
          }}
        </p>
      </div>
      <!--p class="text-grey">Subtitle-1</p>
    <p class="text-grey">Subtitle-2</p-->
      <div v-if="!isUser" class="flex justify-start items-center">
        <vs-avatar
          :text="getFirstLetter(prop.first_name)"
          color="primary"
          size="medium"
          class="mr-3"
          :src="prop.profile_pic ? prop.profile_pic : ''"
        />
        <div>
          <div class="text-dark text-sm">
            {{ fullName }}
          </div>
          <div class="text-xs text-gery flex items-center -mx-4">
            <div class="px-4">{{ Math.floor(Math.random() * 100) }} views</div>
            <div class="px-4">
              {{ prop.video.created_at ? getUploadTime : 'unknown' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import constants from '../../../../constant';
import img from '../../../assets/images/pages/VideoThumbnail.png';
import { ajaxCallMixin } from '../../../http/HttpCommon';
import { utils } from '@/mixins/index';
export default {
  name: 'VideoCard',
  props: ['prop', 'type', 'isUser'],
  mixins: [ajaxCallMixin, utils],
  data() {
    return {
      months: [
        'Jan',
        'Feb',
        'Mar',
        'April',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    };
  },
  computed: {
    fullName() {
      return this.prop.first_name + ' ' + this.prop.last_name;
    },
    baseUrl() {
      return constants.apiUrl;
    },
    defaultImg() {
      return img;
    },
    getUploadTime() {
      const date = Date.now();
      const uploadDate = new Date(this.prop.video.created_at);
      const diff = Math.ceil(Math.abs(date - uploadDate) / 1000);
      if (diff < 60) {
        return diff < 30 ? `Just Now` : `${diff} secs ago`;
      } else if (diff < 60 * 60) {
        const mins = Math.round(diff / 60);
        return mins === 1 ? `${mins} min ago` : `${mins} mins ago`;
      } else if (diff < 60 * 60 * 24) {
        const hours = Math.round(diff / (60 * 60));
        return hours === 1 ? `${hours} hr ago` : `${hours} hrs ago`;
      } else if (diff <= 60 * 60 * 24 * 6.5) {
        const days = Math.round(diff / (60 * 60 * 24));
        return days === 1 ? `${days} day ago` : `${days} days ago`;
      } else if (diff < 60 * 60 * 24 * 7 * 4) {
        const weeks = Math.round(diff / (60 * 60 * 24 * 7));
        return weeks === 1 ? `${weeks} week ago` : `${weeks} weeks ago`;
      } else if (diff < 60 * 60 * 24 * 7 * 4 * 12) {
        const months = Math.round(diff / (60 * 60 * 24 * 7 * 4));
        return months === 1 ? `${months} month ago` : `${months} months ago`;
      } else {
        const years = Math.round(diff / (60 * 60 * 24 * 7 * 4 * 12));
        return years === 1 ? `${years} year ago` : `${years} years ago`;
      }
    },
    usersData() {
      return this.$store.state.AppActiveUser;
    },
  },
  mounted() {
    console.log(this.prop.profile_pic);
  },
  methods: {
    editVideo() {
      this.$store.commit('studio/toggleText');
      this.$router.replace(`/studio/${this.prop.id}`);
    },
    forkVideo() {
      if (this.usersData.id) {
        const url = '/api/fork_video/';
        const data = {};
        data.user_id = this.usersData.id;
        data.published_id = this.prop.published_id;
        this.ajaxCall(url, data, this.callBackFork);
      } else {
        window.location.href = constants.challengeUri;
      }
    },
    callBackFork(apiResponse) {
      if (apiResponse.status) {
        this.$vs.notify({
          title: 'Success',
          text: 'Video Forked Successfully',
          color: 'success',
        });
      } else {
        this.$vs.notify({
          title: 'Not Allowed',
          text: 'You have already Forked this video!',
          color: 'danger',
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.video-card-inner {
  border-radius: 16px;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateX(0);
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);

    /*:img {
      opacity: 0.9;
    }*/
  }
}
.card-body {
  margin: -0.5rem;
}
.video-length {
  position: absolute;
  z-index: 10;
  bottom: 15px;
  right: 20px;
  background: rgba(0, 0, 0, 0.62);
  min-height: 20px;
  min-width: 44px;
  font-size: 9px;
}
.video-length :first-child {
  color: #fff;
  font-weight: 600;
}
.branch-icon {
  height: 12px;
  /* width: 10px; */
  position: absolute;
  margin-top: -1px;
  margin-left: 5px;
}
.fork-btn {
  cursor: pointer;
  background: rgba(114, 71, 196, 0.1) !important;
  border-radius: 16px;
  padding: 0.4rem 0.6rem !important;
}
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 36px;
}
.tooltip {
  position: relative;
  display: inline-block;
  /*border-bottom: 1px dotted black;*/
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 100%;
  background-color: #555;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 5px;
  position: absolute;
  z-index: 1000;
  /* bottom: 125%;*/
  left: 50%;
  /*margin-left: -60px; */
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip:hover .tooltiptext {
  visibility: visible;
  opacity: 1;
}
</style>
