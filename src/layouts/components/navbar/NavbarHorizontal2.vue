<template>
  <div class="relative">
    <div class="vx-navbar-wrapper nav navbar-full p-0">
      <vs-navbar class="navbar-custom navbar-skelton custom-header responsive">
        <div class="flex justify-between lg:w-11/12 w-full">
          <router-link
            tag="div"
            to="/"
            class="vx-logo cursor-pointer md:flex items-center hidden"
          >
            <img
              src="@/assets/images/logo/logo.svg"
              class="mr-2 text-custom-purple h-16"
            />
            <span
              class="vx-logo-text text-dark hidden sm:block md:block lg:block"
              >{{ $t('Navbar.videowiki') }}</span
            >
          </router-link>
          <feather-icon
            class="sm:inline-flex lg:hidden md:hidden cursor-pointer p-2"
            icon="MenuIcon"
            @click.stop="showSidebar"
          />
          <div class="flex items-center text-center -mx-3">
            <div
              class="lg:flex md:flex hidden items-center -mx-base px-3"
              id="navBar"
            >
              <div class="navItem px-base">
                <router-link
                  to="/studio"
                  class="text-dark text-2xl hover-link relative"
                  exact-active-class="link-active"
                  >Editor
                  <vs-chip class="absolute create-chip">
                    <span class="text-primary font-bold">{{
                      $t('Navbar.create')
                    }}</span>
                  </vs-chip>
                </router-link>
              </div>
              <div class="navItem px-base">
                <a
                  href="https://cast.video.wiki/createEvent"
                  target="_blank"
                  class="text-dark text-2xl hover-link relative"
                  exact-active-class="link-active"
                  >Cast
                  <vs-chip class="absolute create-chip">
                    <span class="text-primary font-bold">Events</span>
                  </vs-chip>
                </a>
              </div>
              <div class="navItem px-base">
                <router-link
                  to="/classroom"
                  class="text-dark text-2xl hover-link relative"
                  exact-active-class="link-active"
                  >Room
                  <vs-chip class="absolute create-chip">
                    <span class="text-primary font-bold">Class</span>
                  </vs-chip></router-link
                >
              </div>

              <div class="navItem px-base">
                <community-drop-down />
              </div>
            </div>
            <div class="px-3">
              <profile-drop-down v-if="accessToken" />
              <a v-else style="color: white" :href="challengeUrl">
                <vs-button
                  class="font-bold text-base lg:text-lg"
                  type="filled"
                  >{{ $t('Navbar.login') }}</vs-button
                >
              </a>
            </div>
            <VideoWikiChat />
          </div>
        </div>
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import ProfileDropDown from './components/ProfileDropDown.vue';
import CommunityDropDown from './components/CommunityDropDown.vue';
import VideoWikiChat from '../../../views/VideoWikiChat';
import constants from '../../../../constant';

import { mapState } from 'vuex';

export default {
  name: 'the-navbar-horizontal',
  components: {
    ProfileDropDown,
    CommunityDropDown,
    VideoWikiChat,
  },
  data() {
    return {
      challengeUrl: constants.challengeUri,
    };
  },
  computed: {
    ...mapState('auth', ['isUserLoggedIn', 'accessToken']),
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  methods: {
    showSidebar() {
      this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE', true);
    },
  },
};
</script>
<style lang="scss" scoped>
.nav {
  font-family: Arial, Helvetica, sans-serif !important;
  position: fixed;
  top: 0;
}
.custom-header {
  height: 100px;
  background: white !important;
  border-bottom: none !important;
  box-shadow: none !important;
  display: flex;
}
.create-chip {
  top: -13px;
  left: -45px;
  min-height: 16px !important;
  visibility: hidden;
}
.create-chip span {
  font-size: 8px;
}
#navBar {
  .link-active {
    font-weight: bold;
  }
  .link-active .create-chip {
    visibility: visible;
  }
}

.navItem {
  font-weight: 490;
  box-sizing: border-box;
  width: 150px;
  text-align: center;
}
.navItem a {
  cursor: pointer;
}
.navItem a:hover {
  font-weight: bold;
  cursor: pointer !important;
}
.navItem a:hover .create-chip {
  visibility: visible;
}
</style>
