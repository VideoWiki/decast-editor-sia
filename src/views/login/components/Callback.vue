<template>
  <div id="loading-bg">
    <div class="loading-logo">
      <img src="@/../public/logo.svg" alt="Logo" />
    </div>
    <div class="loading">
      <div class="effect-1 effects"></div>
      <div class="effect-2 effects"></div>
      <div class="effect-3 effects"></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import constant from '../../../../constant';

export default {
  name: 'callback',
  components: {},
  data() {
    return {
      alreadyLogged: false,
    };
  },
  computed: {
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  mounted() {
    this.$vs.notify({
      title: 'Wait',
      iconPack: 'feather',
      icon: 'icon-alert-circle',
      color: 'warning',
    });
    var config = {
      method: 'get',
      url:
        constant.hydra_ep +
        '/api/token/?code=' +
        this.$route.query.code +
        '&origin=cast',
      headers: {},
    };

    axios(config)
      .then((response) => {
        console.log(response.data);
        this.$store
          .dispatch('auth/fetchUser', {
            access_token: response.data.data.token_data.access_token,
            ...response.data.data.user_info,
          })
          .then((res) => {
            console.log(res);
            localStorage.setItem(
              'accessToken',
              response.data.data.token_data.access_token
            );
            location.href = '/';
            // location.href =
            //   'https://dev.stream.video.wiki/saveInfo/?name=' +
            //   response.data.data.user_info.first_name +
            //   '&username=' +
            //   response.data.data.user_info.username +
            //   '&profile_pic=' +
            //   response.data.data.user_info.profile_pic +
            //   '&token=' +
            //   response.data.data.token_data.access_token +
            //   '&origin=editor';
          })
          .catch((_err) => {
            this.$vs.notify({
              title: 'Error',
              text: 'Error occurred',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger',
            });
            window.location.href = constant.challengeUri;
          });
        this.$vs.loading.close();
      })
      .catch((e) => {
        console.log(JSON.stringify(e));
      });
  },
};
</script>
<style lang="scss" scoped></style>
