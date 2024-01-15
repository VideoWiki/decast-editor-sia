<template>
  <div class="center">
    <label class="toggle-switch">
      <input type="checkbox" v-model="isChecked" />
      <span class="slider round"></span>
    </label>
  </div>
</template>

<script>
export default {
  name: 'ToggleButton',
  props: {
    value: Boolean,
  },
  data() {
    return {
      isChecked: this.value,
    };
  },
  watch: {
    isChecked(newValue) {
      this.$emit('input', newValue);
    },
  },
};
</script>
<style scoped>
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}
.toggle-switch input {
  display: none;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f2f4f7;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 15px;
}
.slider.round {
  border-radius: 50px;
}
.slider:before {
  position: absolute;
  content: '';
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: #ffffff;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #7966fa;
}
input:focus + .slider {
  box-shadow: 0 0 1px #7966fa;
}
input:checked + .slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(15px);
}
</style>
