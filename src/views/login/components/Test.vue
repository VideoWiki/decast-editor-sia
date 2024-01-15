<template>
  <section>
    <h1>TEST</h1>
  </section>
</template>

<script>
export default {
  data() {
    return {
      client_id: '.googleusercontent.com',
    };
  },
  methods: {
    callback() {
      console.log('callback');
    },
  },

  // components: { GoogleLogin },
};
</script>
