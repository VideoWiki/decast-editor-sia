<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <footer v-if="teamsInitialized === true"></footer>

  <footer v-else class="the-footer flex-wrap justify-between" :class="classes">
    <div class="flex justify-between">
      <router-link class="text-black mr-5" to="/terms-of-use"
        >Terms</router-link
      >
      <router-link class="text-black mr-5" to="/privacy-policy">
        Privacy
      </router-link>
      <!-- <a class="text-black">License</a>  -->

      <ChangeLog
        class="inline mr-5"
        style="color: #ffffff"
        headText="What's new"
      />

      <a
        href="https://fider.video.wiki/"
        class="text-black mr-5 ml-8"
        target="_parent"
      >
        <span class="ml-2">Features Request</span>
      </a>
    </div>
    <p>
      <span>COPYRIGHT</span>
      <span>{{ new Date().getFullYear() }} </span>
      <a href="https://getboarded.com" target="_blank" rel="nofollow"
        >GetBoarded</a
      >&nbsp;
      <span class="hidden sm:inline-block">, All rights Reserved</span>
    </p>
  </footer>
</template>

<script>
import * as microsoftTeams from '@microsoft/teams-js';
import ChangeLog from '@/views/cannio/ChangeLog.vue';
import Vue from 'vue';
Vue.component('ChangeLog', ChangeLog);
export default {
  name: 'the-footer',
  props: {
    classes: {
      type: String,
    },
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
        this.teamsInitialized = false;
      }
    }, 1000);
  },
  data() {
    return {
      teamsInitialized: false,
    };
  },
};
</script>
