<template>
  <b-modal class="modal" id="are-you-sure-modal" ref="are-you-sure-modal" :title="title" header-bg-variant="primary"
    header-class="text-light" body-bg-variant="dark" body-text-variant="light" footer-bg-variant="dark" :centered="true"
    hide-header-close no-close-on-esc no-close-on-backdrop>
    <div class="row">
      <div class="col-md-12">
        <h5 class="text-light mt-3">{{ message }}</h5>
      </div>
    </div>
    <template #modal-footer>
      <div class="mx-auto">
        <button class="btn btn-secondary mr-5" @click="no">
          <i class="fas fa-times-circle mr-1"></i>Nem
        </button>
        <button class="btn btn-primary" @click="yes">
          <i class="fas fa-check-circle mr-1"></i>Igen
        </button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { EventBus } from "../../stuff/event-bus";

export default {
  data() {
    return {
      title: "Megerősítés",
      message: null,
      parameter: null,
      view: null,
    };
  },
  methods: {
    onShow(e) {
      this.message = e.message;
      this.parameter = e.parameter;
      this.view = e.view;

      this.$refs["are-you-sure-modal"].show();
    },
    onHide() {
      this.$refs["are-you-sure-modal"].hide();
    },
    no() {
      this.onHide();
    },
    yes() {
      EventBus.$emit("yes-clicked", {
        parameter: this.parameter,
        view: this.view,
      });
    },
  },
  mounted() {
    EventBus.$on("show-are-you-sure-modal", this.onShow);
    EventBus.$on("hide-are-you-sure-modal", this.onHide);
  },
  beforeDestroy() {
    EventBus.$off("show-are-you-sure-modal", this.onShow);
    EventBus.$off("hide-are-you-sure-modal", this.onHide);
  },
};
</script>