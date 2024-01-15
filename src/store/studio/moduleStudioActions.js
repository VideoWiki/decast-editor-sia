import store from '../store';
import axios from '../../axios';
import constants from '../../../constant';
import { ConnectWallet } from '../../blockchain/Download';

const actions = {
  // /////////////////////////////////////////////
  // VideoWiki
  // /////////////////////////////////////////////

  fetchVideoChunks({ commit }, meetingId) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          constants.apiUrl + '/api/create_chunks/' + `?meeting_id=${meetingId}`
        )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  breakVideoIntoScenes({ commit }, reuqestBody) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/create_chunks/', reuqestBody)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  extractInfoFromUrl({ commit }, requestBody) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/extract_info_url/', requestBody)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  uploadDoc({ commit }, documentFile) {
    var form = new FormData();
    form.append('file', documentFile);
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/extract_info_file/', form)
        .then((res) => {
          // commit('selectVideo', res.data.video_url);
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  trimVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/trim_video/', payload)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fastVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/speed_up_video/', payload)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  summarizeScript({ commit }) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({
        model: 'text-davinci-003',
        prompt: store.state.studio.video.script + '.nnTl;dr',
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      var config = {
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + constants.apiKey,
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          commit('SET_VIDEO_ATTR', {
            key: 'description',
            value: res.data.choices[0].text.slice(
              2,
              res.data.choices[0].text.length
            ),
          });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  generateTags({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        title: store.state.studio.video.title,
        keywords: [],
      };
      Object.values(store.state.studio.keywords).forEach((arr) => {
        dataObj.keywords.push(...arr);
      });
      axios
        .post(constants.apiUrl + '/api/tags/', dataObj)
        .then((res) => {
          /* let script = '';
          for (const s in res.data) {
            script = script + res.data[s] + ' ';
          } 
          commit('setScript', script); */
          commit('setTags', res.data.tags);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sentenceDetection({ commit }, value) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        text: store.state.studio.video.script,
        /* srcLang: store.state.studio.video.language, */
        break_type: value,
      };
      axios
        .post(constants.apiUrl + '/api/sentence_detection/', dataObj)
        .then((res) => {
          commit('setSentences', res.data.sentences);
          commit('setKeywords', res.data.keywords);
          commit('setSourceLanguage', res.data.srcLang);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /* keywordExtraction({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        text: store.state.studio.video.script,
        srcLang: store.state.studio.video.language
      };
      axios
        .post(constants.apiUrl + '/ke/', dataObj)
        .then(res => {
          commit('setKeywords', res.data);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }, */
  printCharacter(data, script, store) {
    const subString = data;
    let i = 0;
    let actualStr = `${script} `;
    const setInter = setInterval(() => {
      actualStr += subString.slice(i, i + 5);
      store('SET_VIDEO_ATTR', {
        key: 'script',
        value: actualStr,
      });
      i += 5;
      if (actualStr.length >= subString.length + script.length) {
        clearInterval(setInter);
      }
    }, 200);
  },
  generateText({ commit }, text) {
    // var axios = require('axios');
    var data = JSON.stringify({
      prompt: text,
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: 'text-davinci-003',
    });
    console.log();
    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/completions',
      headers: {
        Authorization: 'Bearer ' + constants.apiKey,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          const n = response.data.choices[0].text.charAt(0);
          resolve(response);
          // actions.printCharacter( store, n);
        })
        .catch(function (error) {
          reject(error);
          console.log(error);
        });
    });
  },
  generateImage({ commit }, prompt) {
    const data = JSON.stringify({
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/images/generations',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + constants.apiKey,
      },
      data: data,
    };

    return new Promise((resolve, reject) => {
      axios.request(config).then((res) => {
        resolve(res.data.data[0]);
      });
    });
  },
  generateTitle({ commit }, { text, script }) {
    var data = JSON.stringify({
      prompt: script + '\n suggest an appropriate title to the above text',
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      model: 'text-davinci-003',
    });

    var config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/completions',
      headers: {
        Authorization: 'Bearer ' + constants.apiKey,
        'Content-Type': 'application/json',
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
          console.log(error);
        });
    });
  },
  audioSuggestions({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        keywords: store.state.studio.keywords,
        srcLang: store.state.studio.video.language,
      };
      axios
        .post(constants.apiUrl + '/al/', dataObj)
        .then((res) => {
          commit('setAudios', res.data);
          resolve(res);
        })
        .catch((err) => {
          console.log('error in audio suggestion', err);
          reject(err);
        });
    });
  },
  audioVideoMerge({ commit }, dataObj) {
    return new Promise((resolve, reject) => {
      /* const headers = {
        'Content-Type': 'multipart/form-data'
      }; */
      axios
        .post(constants.apiUrl + '/api/audio_video_merge/', dataObj)
        .then((res) => {
          // commit('setVideoWithAudio', res.data.url);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  videoSuggestions({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        keywords: store.state.studio.keywords,
        srcLang: store.state.studio.video.language,
      };
      axios
        .post(constants.apiUrl + '/api/media_list/', dataObj)
        .then((res) => {
          commit('setVideos', res.data.videos);
          commit('setImages', res.data.images);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  asyncVideoSuggestions({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        keywords: store.state.studio.keywords,
        srcLang: store.state.studio.video.language,
      };
      axios
        .post(constants.apiUrl + '/api/media_list/cel/', dataObj)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getStatusVideo({ commit }, taskId) {
    return new Promise((resolve, reject) => {
      axios
        .get(`${constants.apiUrl}/api/media_list/status/?task_id=${taskId}`)
        .then((res) => {
          if (res.data.status === 'SUCCESS') {
            const videos = {};
            const images = {};
            res.data.output.forEach((item, index) => {
              if (index % 2) {
                images[Math.floor(index / 2)] = item;
              } else {
                videos[Math.floor(index / 2)] = item[Math.floor(index / 2)];
              }
            });
            commit('setVideos', videos);
            commit('setImages', images);
            resolve(true);
          }
          resolve(false);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  searchMedia({ commit }, dataObj) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/media_search/', dataObj)
        .then((res) => {
          // commit('setSearchedVideos', res.data);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addMotionToImage({ commit }, dataObj) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/add_motion/', dataObj)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  editSceneScript({ commit }, sceneScriptData) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/add/subtitle/', sceneScriptData)
        .then((res) => {
          // commit("setVideos", res.data)
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  getStatus({ commit }, taskId) {
    return new Promise((resolve, reject) => {
      axios
        .get(constants.apiUrl + `/api/add/subtitle/status/?task_id=${taskId}`)
        .then((res) => {
          resolve(res.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },

  concatenateVideos({ commit }, videoWikiData) {
    return new Promise((resolve, reject) => {
      /* const dataObj = {
        videos
      } */
      axios
        .post(constants.apiUrl + '/api/video/concat/', videoWikiData)
        .then((res) => {
          // commit("setVideos", res.data)
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  download({ commit }) {
    ConnectWallet();
  },
  uploadMedia({ commit }, payload) {
    var form = new FormData();
    form.append('media', payload.media);
    form.append('task_id', payload.task_id);
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/upload/media/', form)
        .then((res) => {
          // commit('selectVideo', res.data.video_url);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  publishVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/publish_video/', payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  saveVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/save_video/', payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getVideoData({ commit }, videoId) {
    commit('setInitialState');
    return new Promise((resolve, reject) => {
      axios
        .get(constants.apiUrl + '/api/video_details?saved_video_id=' + videoId)
        .then((res) => {
          const apiResponse = res.data.data;
          const videoData = {};
          const videoDataKeys = [
            'title',
            'script',
            'description',
            'language',
            'bg_music',
            'published_id',
            'url',
          ];
          videoDataKeys.forEach((key) => {
            videoData[key] = apiResponse[key];
          });
          videoData.is_paid = false;
          videoData.saved_id =
            apiResponse.video_type === 'saved'
              ? apiResponse.saved_video_id
              : null;
          commit('SET_VIDEO', videoData);
          commit('setTags', apiResponse.tags);
          const sentences = {};
          const keywords = {};
          Object.entries(apiResponse.scenes).forEach(([key, value]) => {
            sentences[key] = value.subtitle.text;
            keywords[key] = value.keywords;
            commit('setTransition', {
              sceneNum: parseInt(key),
              value: value.transition,
            });
            commit('setRecordedAudio', {
              sceneNum: parseInt(key),
              value: value.audio.url,
            });
            commit('selectMedia', {
              sceneNum: parseInt(key),
              value: {
                id: value.media.lib_media_id,
                url: value.media.url,
              },
            });
            commit('SET_STYLE', {
              sceneNum: parseInt(key),
              value: value.subtitle.style,
            });
          });
          commit('setSentences', sentences);
          commit('setKeywords', keywords);
          commit('skipSubtitles');
          commit('skipMusic');
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  resetState({ commit }) {
    commit('setInitialState');
  },
  postTxData({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/transaction/oceanbuy', payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  uploadToCloud({ commit }, { file, connectSTr, container }) {
    const data = new FormData();
    data.append('file', file);
    data.append('azure_container', container);
    data.append('azure_connect_str', connectSTr);

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.storage.video.wiki/api/upload/',
      headers: {
        Authorization: constants.StorageKey,
      },
      data: data,
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then((response) => {
          resolve(response.data);
        })
        .catch((e) => {
          reject(e);
        });
    });
  },
  checkStatus({ commit }, payload) {
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url:
        'https://api.storage.video.wiki/api/upload/status/?task_id=' + payload,
      headers: {
        Authorization: constants.StorageKey,
      },
    };
    return new Promise((resolve, reject) => {
      axios(config)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((e) => {
          console.log(e, 'dsd');
          reject(e);
        });
    });
  },
};
export default actions;
