<!-- eslint-disable prettier/prettier -->
<template>
  <div>
    <div v-if="haveLoginOptions">
      <h2 class="text-center">
        Sign in <strong>VideoWiki<br /></strong>
      </h2>
      <p class="mb-12 mt-2 text-center" style="color: black; font-size: 20px">
        Choose a account
      </p>
      <div class="">
        <div
          v-for="(item, key, index) in loginOptions"
          class="w-full px-4 cursor-pointer flex border items-center justify-between"
        >
          <div
            @click="autoLogin(key, item.token)"
            class="con-img ml-3 my-1 pt-2 px-2"
          >
            <vs-avatar
              :text="getFirstLetter(key)"
              color="primary"
              class="m-0 shadow-md"
              :src="
                activeUserInfo.profile_pic ? activeUserInfo.profile_pic : ''
              "
              size="40px"
            />
          </div>
          <div
            @click="autoLogin(key, item.token)"
            class="mt-2 px-8 w-10/12 h-full"
          >
            <h5 class="w-full">{{ key }}</h5>
            <p>{{ item.name }}</p>
          </div>
          <div class="w-2/10 pt-2" @click="deleteUser(key)">
            <vs-tooltip text="Remove Account">
              <span></span>
              <vs-icon
                icon-pack="feather"
                icon="icon-minus-circle"
                class="cursor hover"
                size="24px"
                rounded="true"
              >
              </vs-icon>
            </vs-tooltip>
          </div>
        </div>
      </div>
      <div class="pt-0">
        <p class="pt-4 pb-10 font-semibold">
          <span class="cursor-pointer" @click="haveLoginOptions = false">
            <vs-icon
              icon-pack="feather"
              icon="icon-user"
              class="px-6 py-2"
              size="26px"
              rounded="rounded-lg"
              color="primary"
            >
            </vs-icon>
            Use other Account</span
          >
        </p>
      </div>
    </div>

    <div v-else>
      <h1 class="heading"><b>Login VideoWiki</b></h1>
      <h2 :style="{ color: currentButton.color }">
        {{ currentButton.text }}
      </h2>
      <p style="color: black; font-size: 16px">
        {{ currentButton.description }}
      </p>
      <div>
        <Restricted />
      </div>
    </div>
  </div>
</template>

<script>
import Restricted from './Restricted.vue';
import { utils } from '@/mixins/index';
import constants from '../../../../constant';
export default {
  mixins: [utils],
  name: 'LoginModes',
  components: {
    Restricted,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    buttons: {
      type: Array,
      default: () => [
        {
          link: 'Login',
          color: '#DA9921',
          percent: '0%',
        },
        {
          text: 'Web2',
          link: 'Google Login',
          color: '#4CD964',
          percent: '50%',
          description: 'Login using your Social Profile',
        },
        {
          text: 'Web3',
          link: 'Wallet Login',
          color: '#F30200',
          percent: '100%',
          description: 'Login With Crypto Wallet',
        },
      ],
    },
    linkMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentButton: '',
      haveLoginOptions: false,
      loginOptions: JSON.parse(localStorage.getItem('otherAccount')),
      currentI: 0,
      proxyValue: '',
      msg: '',
    };
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
  },
  methods: {
    async deleteUser(user) {
      this.$delete(this.loginOptions, user);
      if (Object.keys(this.loginOptions).length === 0) {
        this.haveLoginOptions = false;
      }
      localStorage.setItem('otherAccount', JSON.stringify(this.loginOptions));
    },
    autoLogin(username, token) {
      var payload = {
        username: username,
        lc: this.$route.query.login_challenge,
        token: token,
      };
      this.$vs.loading();
      this.$store
        .dispatch('auth/autoLogin', payload)
        .then((res) => {
          console.log(res.data);
          location.href = res.data.redirect_to;
          this.$vs.loading.close();
        })
        .catch((e) => {
          console.log(e);
          this.$vs.notify({
            title: 'Challenge Expired',
            text: 'Try Again',
            color: 'danger',
          });
          this.$vs.loading.close();
          // location.href = constants.challengeUri;
        });
      // axios
      //   .get(
      //     `${constants.hydra_ep}/api/auto/login?username=${this.activeUserInfo.username}&login_challenge=${this.$route.query.login_challenge}`
      //   )
      //   .then((res) => {
      //     console.log(this.res);
      //   })
      //   .catch((e) => {
      //     console.log('e', e);
      //   });
    },
  },
  watch: {},
  created() {
    this.haveLoginOptions =
      this.loginOptions && Object.keys(this.loginOptions).length > 0;
    console.log('have', JSON.stringify(this.loginOptions));
  },
};
</script>

<style scoped>
button {
  border-radius: 15px;
  cursor: pointer;
}
.heading {
  display: flex;
  justify-content: center;
  align-content: center;
  align-self: center;
  text-align: center;
  margin-top: 0%;
  padding-top: 0%;
}
</style>

<style lang="scss">
.tooltip {
  // ...

  &.popover {
    $color: #000;

    .popover-inner {
      background: $color;
      color: white;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }
}
.tooltip-arrow {
  z-index: 10000;
}
</style>
