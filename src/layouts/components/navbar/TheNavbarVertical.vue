<!-- =========================================================================================
  File Name: TheNavbar.vue
  Description: Navbar component
  Component Name: TheNavbar
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div v-if="!insideIframe" class="relative">
    <div class="vx-navbar-wrapper" :class="classObj">
      <vs-navbar
        class="vx-navbar navbar-custom navbar-skelton"
        :color="navbarColorLocal"
        :class="textColor"
      >
        <!-- SM - OPEN SIDEBAR BUTTON -->
        <feather-icon
          class="sm:inline-flex xl:hidden cursor-pointer p-2"
          icon="MenuIcon"
          @click.stop="showSidebar"
        />

        <!--        <bookmarks :navbarColor="navbarColor" v-if="windowWidth >= 992" />-->

        <vs-spacer />

        <!--i18n class="mr-3" /-->

        <!--<search-bar />-->

        <!--        <notification-drop-down />-->
        <div class="flex mr-4 flex-wrap">
          <!-- <wallet /> -->
        </div>
        <profile-drop-down v-if="accessToken" />
        <span v-else-if="teamsInitialized === true"></span>
        <vs-button
          v-else
          @click="login"
          class="font-bold text-base lg:text-lg"
          type="filled"
          >{{ $t('Navbar.login') }}</vs-button
        >
      </vs-navbar>
    </div>
  </div>
</template>

<script>
import * as microsoftTeams from '@microsoft/teams-js';
import Bookmarks from './components/Bookmarks.vue';
import I18n from './components/I18n.vue';
import SearchBar from './components/SearchBar.vue';
import NotificationDropDown from './components/NotificationDropDown.vue';
import ProfileDropDown from './components/ProfileDropDown.vue';
import { mapState } from 'vuex';
import Wallet from './components/Wallet.vue';
import constants from '../../../../constant';

export default {
  name: 'the-navbar-vertical',
  props: {
    navbarColor: {
      type: String,
      default: '#fff',
    },
  },
  data() {
    return {
      challengeUrl: constants.challengeUri,
    };
  },
  components: {
    Bookmarks,
    I18n,
    SearchBar,
    NotificationDropDown,
    ProfileDropDown,
    Wallet,
  },
  created() {
    var teamsInitialized = false;
    microsoftTeams.initialize(() => {
      teamsInitialized = true;
    });

    setTimeout(() => {
      if (teamsInitialized) {
        this.teamsInitialized = true;
      } else {
      }
    }, 0);
  },
  computed: {
    ...mapState('auth', ['isUserLoggedIn', 'accessToken']),
    navbarColorLocal() {
      return this.$store.state.theme === 'dark' && this.navbarColor === '#fff'
        ? '#10163a'
        : this.navbarColor;
    },
    textColor() {
      return {
        'text-white':
          (this.navbarColor != '#10163a' &&
            this.$store.state.theme === 'dark') ||
          (this.navbarColor != '#fff' && this.$store.state.theme !== 'dark'),
      };
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    // NAVBAR STYLE
    classObj() {
      let classStr = '';
      if (this.$store.state.insideIframe) {
        classStr += 'reduced-width-iframe ';
      }
      if (this.$store.state.verticalNavMenuWidth === 'default')
        classStr += 'navbar-default ';
      else if (this.$store.state.verticalNavMenuWidth === 'reduced')
        classStr += 'navbar-reduced ';
      else classStr += 'navbar-full';
      return classStr;
    },
    insideIframe() {
      return this.$store.state.insideIframe;
    },
  },
  data() {
    return {
      vivek: false,
      teamsInitialized: false,
    };
  },
  methods: {
    login() {
      window.location.href = constants.challengeUri;
    },
    showSidebar() {
      this.$store.commit('TOGGLE_IS_VERTICAL_NAV_MENU_ACTIVE_STUDIO', true);
    },
  },
};
</script>
<style scoped>
.reduced-width-iframe {
  width: 72% !important;
}
</style>
