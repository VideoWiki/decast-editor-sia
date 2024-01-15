<template>
  <div>
    <form v-if="currentTabIndex === 0">
      <vx-card :title="$t('studio.text.t1')" class="text-window">
        <div class="text-left">
          <input
            type="text"
            id="title"
            name="title"
            size="large"
            :placeholder="$t('studio.text.t2')"
            maxlength="100"
            v-model="title"
            class="w-full mt-3 mb-3 title2"
            v-validate="'required'"
            autocomplete="off"
          />
          <div class="flex items-start -mx-2">
            <div class="px-2">
              <LanguageSelect v-model="srcLang" />
            </div>
            <div class="px-2">
              <vs-dropdown
                vs-custom-content
                vs-trigger-click
                class="cursor-pointer"
              >
                <span
                  class="cursor-pointer flex items-center"
                  style="transform: translate(0px, -2px)"
                >
                  <span class="font-bold">{{
                    breakTypeOptions[breakType]
                  }}</span>
                  <vs-icon icon-pack="feather" icon="icon icon-chevron-down" />
                </span>
                <vs-dropdown-menu class="w-48 i18n-dropdown vx-navbar-dropdown">
                  <vs-dropdown-item @click="breakType = 'short'">
                    &nbsp;Short Scenes</vs-dropdown-item
                  >
                  <vs-dropdown-item @click="breakType = 'long'">
                    &nbsp;Long Scenes</vs-dropdown-item
                  >
                </vs-dropdown-menu>
              </vs-dropdown>
            </div>
          </div>
          <div class="textArea_script mb-2">
            <textarea
              type="text"
              id="script"
              name="script"
              :placeholder="$t('studio.text.t5')"
              @keyup="scriptLength"
              :maxlength="maxChars"
              v-model="script"
              v-validate="'required'"
              class="w-full mt-3 mb-3 video-script2"
            >
            </textarea>
            <div class="flex items-center justify-between">
              <vs-button
                type=""
                @click="generateText(script)"
                class="p-2 m-4 ml-10 justify-items-end hover:bg-primary hoverEffect"
              >
                <div class="justify-content text-center inline-flex">
                  <span class="flex">
                    <img
                      src="../../assets/images/logo/openai.svg"
                      class="h-5"
                    />
                  </span>
                  <span
                    class="flex self-center content-center justify-content-center ml-2"
                  >
                    <p
                      class="self-center align-center text-sm"
                      style="text-align: center"
                    >
                      Generate Text
                    </p>
                  </span>
                </div>
              </vs-button>
              <vs-button
                v-if="generating"
                type=""
                @click="stopGenerating"
                class="p-2 px-4 py-2 m-3 ml-8 mr-4 justify-items-center hover:bg-custom-grey hoverEffect"
              >
                <div class="justify-content text-center inline-flex">
                  <span
                    class="flex self-center content-center justify-content-center"
                  >
                    <p
                      class="self-center align-center text-sm"
                      style="text-align: end"
                    >
                      Stop Generating
                    </p>
                  </span>
                </div>
              </vs-button>
            </div>
          </div>
          <div id="box" class="align flex justify-between">
            <div class="d-message">
              <span
                class="text-danger text-left text-bold"
                id="title"
                color="danger"
              >
                <p v-if="displayMessage">
                  Subscribe To Videowiki Premium to Enter a longer Script Text
                </p>
              </span>
            </div>
            <div class="result">
              <div
                @input="resultInput()"
                :class="[displayMessage ? 'redDiv' : 'greenDiv']"
              >
                <span class="text-right result text-bold"
                  ><p>{{ result }}</p>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="items-center">
          <div class="w-full items-center">
            <vs-button color="primary" @click.prevent="handleSubmit">{{
              $t('studio.text.t6')
            }}</vs-button>
          </div>
        </div>
      </vx-card>
    </form>
    <DocumentUpload v-else-if="currentTabIndex === 1" />
    <ExternalUrl v-else />
  </div>
</template>

<script>
import LanguageSelect from './components/LanguageSelect.vue';
import DocumentUpload from './components/DocumentUpload';
import ExternalUrl from './components/ExternalUrl';
import constants from '../../../constant';
import axios from '../../axios';
export default {
  components: {
    LanguageSelect,
    DocumentUpload,
    ExternalUrl,
  },
  data() {
    return {
      form: {
        title: '',
        description: '',
        script: '',
      },
      generating: true,
      clicked: false,
      inputScriptAlert: false,
      maxChars: 1000,
      scriptError: false,
      remainingChars: 0,
      accept: true,
      cancel: false,
      result: '',
      displayMessage: false,
      options: [
        { value: 'en', label: 'English' },
        { value: 'ru', label: 'Russian' },
        { value: 'pt', label: 'Portuguese' },
      ],
      localStorageAttributes: {
        title: '',
        script: '',
        description: '',
        language: '',
        bg_music: '',
        published_id: '',
        url: '',
        scenes: [],
      },
      breakType: 'short',
      breakTypeOptions: {
        long: 'Long Scenes',
        short: 'Short Scenes',
      },
    };
  },
  computed: {
    script: {
      get() {
        return this.$store.state.studio.video.script;
      },
      set(value) {
        this.$store.commit('studio/SET_VIDEO_ATTR', {
          key: 'script',
          value: value,
        });
      },
    },
    srcLang: {
      get() {
        return this.$store.state.studio.video.language;
      },
      set(value) {
        this.$store.commit('studio/SET_VIDEO_ATTR', {
          key: 'language',
          value: value,
        });
      },
    },
    title: {
      get() {
        return this.$store.state.studio.video.title;
      },
      set(value) {
        this.$store.commit('studio/SET_VIDEO_ATTR', {
          key: 'title',
          value: value,
        });
      },
    },
    description: {
      get() {
        return this.$store.state.studio.video.description;
      },
      set(value) {
        this.$store.commit('studio/SET_VIDEO_ATTR', {
          key: 'description',
          value: value,
        });
      },
    },
    currentTabIndex() {
      return this.$store.state.studio.tabIndex;
    },
  },
  created() {},
  beforeDestroy() {
    document.querySelectorAll('body > div.vs-component').forEach((el) => {
      el.remove();
    });
    document.querySelectorAll('body > div.vs-content-sidebar').forEach((el) => {
      el.remove();
    });
  },
  methods: {
    stopGenerating() {
      this.generating = !this.generating;
    },
    printChar(data) {
      const script = '';
      const subString = data;
      let i = 0;
      let actualStr = `${script} `;
      console.log('Edhar ', data);
      const setInter = setInterval(() => {
        actualStr += subString.slice(i, i + 5);
        this.$store.commit('studio/SET_VIDEO_ATTR', {
          key: 'script',
          value: actualStr,
        });
        i += 5;

        if (
          actualStr.length > subString.length + script.length ||
          !this.generating
        ) {
          clearInterval(setInter);
          this.generating = false;
        }
      }, 200);
    },
    generateText(text) {
      if (text.length !== 0) {
        this.$vs.loading();
        this.maxChars = 2500;
        this.generating = true;
        // this.getText(text);
        console.log(text);
        this.$store
          .dispatch('studio/generateText', text)
          .then((response) => {
            const data = response.data.choices[0].text.trim();
            this.printChar(data);
          })
          .catch((e) => {
            console.log(e);
          })
          .finally(() => {
            this.$vs.loading.close();
          });
      } else {
        if (this.clicked) {
          return;
        }
        this.clicked = true;
        this.$vs.notify({
          title: 'Error',
          text: "Script can't be empty ",
          iconPack: 'feather',
          color: 'danger',
        });
        setTimeout(() => {
          this.clicked = false;
        }, 2900);
      }
    },
    handleSubmit() {
      if (this.displayMessage) {
        this.$vs.notify({
          title: 'Invalid Input',
          text: `Script should be less than ${this.maxChars} characters`,
          color: 'warning',
        });
        return;
      }
      this.$validator.validateAll().then((result) => {
        if (this.title.length === 0) {
          this.$store
            .dispatch('studio/generateTitle', {
              text: 'text',
              script: this.script,
            })
            .then((res) => {
              this.title = res.data.choices[0].text;
            })
            .catch((e) => {
              console.log(e);
              this.$vs.loading.close();
            });
          this.createScenes();
        } else {
          this.createScenes();
        }
      });
    },
    scriptLength() {
      // console.log(this.script);
      if (this.script.length > this.maxChars) {
        this.displayMessage = true;
      } else {
        this.displayMessage = false;
      }
    },
    resultInput() {
      this.result = this.script.length + '/' + this.maxChars;
    },
    setDescription() {
      this.$store.dispatch('studio/summarizeScript').then((res) => {});
    },

    createScenes() {
      if (this.result > this.maxChars) {
        this.$vs.notify({
          title: 'ALERT:',
          text: `Only ${this.maxChars} characters are acceptable in Script.Please Edit Script or Subscribe To Premium`,
          color: 'warning',
        });
      }
      this.$Progress.start();
      this.$vs.loading({ color: 'transparent' });
      this.$store
        .dispatch('studio/sentenceDetection', this.breakType)
        .then((res) => {
          if (this.script.length < 1000) {
            this.videoSuggestions();
          } else {
            this.asyncVideoSuggestions();
          }
        })
        .catch((err) => {
          console.log(err);
          this.$Progress.fail();
          this.$vs.loading.close();
          if (err.response.status === 401) {
            this.$vs.notify({
              title: 'Login Expires',
              text: 'Login to continue',
              color: 'danger',
            });
            this.$cookies.remove('userId');
            this.$cookies.remove('Token');
            setTimeout(() => {
              this.$router.push('/login');
            }, 500);
            setTimeout(() => {
              this.$store.dispatch('auth/logOut');
            }, 600);
            return;
          }
          this.$vs.notify({
            title: 'Error Occurred',
            text: 'Video Suggestions',
            color: 'danger',
          });
        });
    },
    asyncVideoSuggestions() {
      this.$store
        .dispatch('studio/asyncVideoSuggestions')
        .then((res) => {
          this.getStatus(res.data.task_id);
        })
        .catch((err) => {
          console.log(err);
          this.$Progress.fail();
          this.$vs.loading.close();
          if (err.response.status === 401) {
            this.$vs.notify({
              title: 'Error Occured',
              text: 'Video Suggestions',
              color: 'danger',
            });
          }
        });
    },
    getStatus(taskId) {
      this.$store.dispatch('studio/getStatusVideo', taskId).then((res) => {
        if (res) {
          this.$Progress.finish();
          this.$vs.loading.close();
          this.$store.commit('studio/resetState');
        } else {
          setTimeout(() => this.getStatus(taskId), 2000);
        }
      });
    },
    videoSuggestions() {
      this.$store
        .dispatch('studio/videoSuggestions')
        .then((resVideos) => {
          this.$Progress.finish();
          this.$vs.loading.close();
          this.$store.commit('studio/resetState');
        })
        .catch((err) => {
          console.log(err);
          this.$Progress.fail();
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Error Occurred',
            text: 'Sentence Detection',
            color: 'danger',
          });
        });
    },
  },
  watch: {
    script: {
      handler(newVal) {
        this.resultInput();
        this.scriptLength();
      },
      immediate: true,
    },
    generate: {
      handler(newVal) {
        if (newVal) {
          this.maxChars = 2500;
        } else {
          this.maxChars = 1000;
        }
        this.resultInput();
      },
    },
  },
};
</script>

<style scoped>
[contentEditable='true']:empty:not(:focus):before {
  content: attr(data-text);
}
::placeholder {
  color: #626262;
  opacity: 0.7;
}

.border {
  border: 0.5px solid lightgray;
}
.title1 {
  height: 40px !important;
  border: none;
  font-size: 14px;
  overflow-y: auto;
  border-radius: 5px;
  color: #626262;
  opacity: 1; /* Firefox */
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}
.title2 {
  height: 40px !important;
  border: 0.5px solid lightgray;
  font-size: 14px;
  overflow-y: auto;
  border-radius: 5px;
  color: #626262;
  opacity: 1; /* Firefox */
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}

.description2 {
  height: 60px !important;
  border-radius: 5px;
  border: 0.5px solid lightgray;
  font-size: 14px;
  overflow-y: auto;
  color: #626262;
  opacity: 1;
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}
.video-script2 {
  height: 250px !important;
  border: 0.5px solid lightgray;
  font-size: 14px;
  overflow-y: auto;
  border-radius: 5px;
  color: #626262;
  opacity: 1;
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}
.video-script.vs-con-textarea >>> .vs-textarea {
  height: 250px !important;
}

.items-center {
  text-align: center;
  text-align: -moz-center;
  text-align: -webkit-center;
}

.items-left {
  text-align: left;
  text-align: -moz-left;
  text-align: -webkit-left;
}

.hoverEffect {
  color: black;
}

.textArea_script {
  border: 0.5px solid lightgray;
  border-radius: 5px;
  color: #626262;
}

.hoverEffect:hover {
  color: white;
  opacity: 0.7;
}

.video-script2 {
  height: 250px !important;
  font-size: 14px;
  resize: none;
  overflow-y: auto;
  border: none;
  opacity: 1;
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}

.items-right {
  text-align: right;
  text-align: -moz-right;
  text-align: -webkit-right;
}

/*.text-window {
  height: 33rem;
  margin-top: calc(100% - 33rem);
} */
.align {
  height: 5px;
  border: 3px solid white;
  border-radius: 3px;
  padding: 0.5rem;
  margin-bottom: 25px;
}
.result {
  align-items: right;
}
.d-message {
  align-items: left;
}
.text-window .vx-card {
  /*height: 20rem;*/
  border: 0.5px solid gray;
}

.text-window .vx-card div {
  padding: 0.2rem;
  height: 15rem;
  overflow-y: auto;
}
.greenDiv {
  color: green;
}
.redDiv {
  color: red;
}
.text-window .vx-card {
  border: 1px solid rgba(0, 0, 0, 0.2);
}
</style>
