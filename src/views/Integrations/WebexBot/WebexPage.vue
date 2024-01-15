<template>
  <PageLayout :pluginName="$options.PLUGIN_NAMES.WEBEX_BOT">
    <template v-slot:pluginTitle>
      {{$t('WebexBot.videowiki')}} <br />{{$t('WebexBot.wb')}}
    </template>
    <template v-slot:pluginDesc>
     {{$t('WebexBot.About.title1')}}
    </template>
  </PageLayout>
</template>
<script>
import { PLUGIN_NAMES } from '@/assets/data';
import PageLayout from '../components/PageLayout';
export default {
  name: 'WebexPage',
  components: {
    PageLayout
  },
  PLUGIN_NAMES
};
</script>
