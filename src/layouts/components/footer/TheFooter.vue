<template>
  <div class="footer-stciky">
    <footer class="footer bg-white">
      <vs-row class="section flex flex-wrap">
        <vs-col class="company-info lg:w-3/12 mb-4 mx-auto">
          <router-link
            tag="div"
            to="/"
            class="vx-logo cursor-pointer flex items-center mb-6"
          >
            <img
              src="@/assets/images/logo/logo.svg"
              class="mr-2 lg:h-16 h-12"
            />
            <span class="vx-logo-text text-prp">{{ $t('Footer.title') }}</span>
          </router-link>
          <div class="text-base lg:w-9/12 flex vs-justify-center">
            <p class="lg:w-full">
              {{ $t('Footer.info') }}
            </p>
          </div>
        </vs-col>
        <vs-col class="lg:w-9/12 mt-1">
          <vs-row>
            <vs-col class="lg:w-1/4 md:w-1/2 sm:w-1/2">
              <FooterLinks sectionName="Product" class="footer-links" />
            </vs-col>
            <vs-col class="lg:w-1/4 md:w-1/3 sm:w-1/3">
              <FooterLinks sectionName="Company" class="footer-links" />
            </vs-col>
            <vs-col class="lg:w-1/4 md:w-1/2 sm:w-1/2">
              <FooterLinks
                sectionName="Ecosystem"
                class="footer-links"
              />
            </vs-col>
            <vs-col class="lg:w-1/4 md:w-1/2 sm:w-1/2 textwh">
              <FooterLinks sectionName="Contact" class="footer-links textwh" />
            </vs-col>
          </vs-row>
        </vs-col>
      </vs-row>
      <vs-divider class="m-0" />
      <div
        class="flex justify-between lg:w-10/12 md:w-2/3 w-full mt-2 mx-auto p-2"
      >
        <div class="flex">
          <router-link class="text-black mr-5" to="/terms-of-use"
            >Terms</router-link
          >
          <router-link class="text-black mr-6" to="/privacy-policy"
            >Privacy</router-link
          >
          <!--a class="text-black">License</a-->
          <change-log
            class="inline"
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
        <div>
          <vs-icon
            icon-pack="feather"
            icon="icon-linkedin"
            rounded="true"
            size="20px"
            class="mr-5 cursor-pointer"
            @click="openUrl('https://www.linkedin.com/company/videowiki.pt/')"
          ></vs-icon>
          <vs-icon
            icon-pack="feather"
            icon="icon-file-text"
            rounded="true"
            size="20px"
            class="mr-5 cursor-pointer"
            @click="openUrl('https://medium.com/videowiki-pt')"
          ></vs-icon>
          <vs-icon
            icon-pack="feather"
            icon="icon-twitter"
            rounded="true"
            size="20px"
            class="cursor-pointer"
            @click="openUrl('https://twitter.com/VideoWiki_PT')"
          ></vs-icon>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import FooterLinks from './components/FooterLinks';
import ChangeLog from '@/views/cannio/ChangeLog.vue';

export default {
  name: 'the-footer',
  components: {
    FooterLinks,
    ChangeLog,
  },
  props: {
    classes: {
      type: String,
    },
  },
  methods: {
    openUrl(url) {
      window.open(url, '_blank');
    },
  },
};
</script>
<style scoped>
.section {
  padding: 3% 10%;
}
</style>
