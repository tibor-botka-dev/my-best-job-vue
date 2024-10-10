<template>
  <section>
    <div class="loader" :class="{ 'd-none': !show }">
      <div class="base-inner">
        <span class="inner one"></span>
        <span class="inner two"></span>
        <span class="inner three"></span>
        <p class="loading-text text-light text-center mt-5">{{ title }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import { EventBus } from "../stuff/event-bus";

export default {
  data() {
    return {
      title: null,
      show: false,
    };
  },
  methods: {
    showLoading(e) {
      this.title = e.title || "Betöltés...";
      this.show = true;
    },

    hideLoading() {
      this.show = false;
    },
  },
  mounted() {
    EventBus.$on("show-loading", this.showLoading);
    EventBus.$on("hide-loading", this.hideLoading);
  },
  beforeDestroy() {
    EventBus.$off("show-loading", this.showLoading);
    EventBus.$off("hide-loading", this.hideLoading);
  },
};
</script>
