<template>
  <div class="custom-background">
    <navbar />

    <div class="container">
      <div v-if="initialized" class="row page-title align-items-center" :class="initialized ? 'mt-4 mb-2' : 'pt-4'">
        <div class="col-md-2">
          <button v-if="canGoBack" class="btn btn-secondary float-left" @click="goBack">
            <i class="fas fa-undo-alt mr-1"></i>Vissza
          </button>
        </div>
        <div class="col-md-8">
          <p class="page-title">{{ title }}</p>
        </div>
        <div v-if="idleSetting?.turnedOn && authentication?.isLoggedIn" class="col-md-2">
          <v-idle ref="idle" @idle="onIdle" @remind="onRemind" class="text-success font-weight-bold float-right"
            :loop="idleSetting.loop" :reminders="idleSetting.reminders" :wait="idleSetting.wait"
            :duration="idleSetting.duration" v-show="!idleSetting.inBackground" />
        </div>
      </div>

      <router-view class="pb-3 text-light"></router-view>
    </div>

    <loading />
    <idle-modal />
  </div>
</template>

<script>
import navbar from "./components/navbar";
import loading from "./components/loading";
import idleModal from "./components/modals/idle-modal";
import { EventBus } from "./stuff/event-bus";
import authenticationService from "./services/authentication-service";
import initService from "./services/init-service";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    navbar,
    loading,
    idleModal,
  },
  data() {
    return {
      modalOpen: null
    };
  },
  computed: {
    ...mapState(["idleSetting", "initialized", "title", "authentication"]),
    canGoBack() {
      if (!this.$store.state.route?.from)
        return;

      return true;
    },
  },
  methods: {
    ...mapMutations(["setInit"]),
    async initialize() {
      this.showLoading(true, "Adatok betöltése...");
      const response = await initService.initApp();
      this.showLoading();

      if (!response?.status?.toString().startsWith("20"))
        this.showToast(
          "Hiba az adatok betöltésekor",
          "Adatok betöltése nem sikerült",
          response.data
        );

      if (this.idleSetting?.turnedOn)
        this.addIdleEvents();
      else
        this.clearIdleEvents();
    },
    async onIdle() {
      this.showLoading(true, "Kijelentkezés...");

      if (this.modalOpen) {
        EventBus.$emit("hide-idle-modal");
        this.modalOpen = false;
      }

      const response = await authenticationService.signOut();
      this.showLoading();
      if (response.isSuccessStatusCode)
        authenticationService.redirectSignIn();

      this.showToast(
        "Hiba kijelentkezéskor",
        "Nem sikerült kijelentkeztetni a felhasználót.",
        response.data
      );
    },
    onRemind(time) {
      if (time) {
        this.clearIdleEvents();
        this.modalOpen = true;
        EventBus.$emit("show-idle-modal", time);
      }
    },
    clearIdleEvents() {
      for (let i = this.$refs.idle?.events?.length - 1; i >= 0; i -= 1) {
        window.removeEventListener(
          this.$refs.idle.events[i],
          this.$refs.idle.clearTimer
        );
      }
    },
    addIdleEvents() {
      for (let i = this.$refs.idle?.events?.length - 1; i >= 0; i -= 1) {
        window.addEventListener(
          this.$refs.idle.events[i],
          this.$refs.idle.clearTimer
        );
      }
      this.$refs.idle.clearTimer();
    },
    goBack() {
      this.$router.back();
    },
  },
  async mounted() {
    if (!this.initialized)
      await this.initialize();
    EventBus.$on("add-idle-events", this.addIdleEvents);
  },
  beforeDestroy() {
    EventBus.$off("add-idle-events", this.addIdleEvents);
  }
};
</script>