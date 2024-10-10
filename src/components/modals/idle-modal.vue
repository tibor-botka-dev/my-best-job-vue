<template>
  <div>
    <b-modal id="idle-modal" ref="idle-modal" title="Kijelentkeztetés" header-bg-variant="primary"
      header-class="text-light" body-text-variant="primary" body-bg-variant="dark" footer-bg-variant="dark"
      ok-variant="danger" :centered="true" no-close-on-esc hide-header-close no-close-on-backdrop>
      <div class="text-justify">
        <p class="text-light">
          Hosszabb ideje inaktív az oldalon. Ha nem marad bejelentkezve a
          rendszer automatikusan kijelentkezteti
          <strong class="text-primary">{{ remainingSeconds }} másodperc</strong>
          után.
        </p>
      </div>
      <template #modal-footer>
        <div class="mx-auto">
          <button class="btn btn-secondary mr-5" @click="logout">
            <i class="fas fa-sign-out mr-1"></i>Kijelentkezés
          </button>
          <button class="btn btn-primary" @click="refreshToken">
            <i class="fas fa-sign-in mr-1"></i>Bejelentkezve maradok
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>
<script>
import { EventBus } from "../../stuff/event-bus";
import tokenService from "../../services/token-service";
import authenticationService from "../../services/authentication-service";
export default {
  data() {
    return {
      refreshTokenExpires: null,
      remainingSeconds: null,
    };
  },
  computed: {
    refreshTokenExpiresDate() {
      if (!this.refreshTokenExpires) {
        return;
      }

      return new Date(this.refreshTokenExpires);
    },
  },
  methods: {
    onShow(e) {
      this.remainingSeconds = e;
      this.$refs["idle-modal"].show();
    },
    onHide() {
      this.$refs["idle-modal"].hide();
    },
    refreshToken() {
      EventBus.$emit("add-idle-events");
      tokenService.refreshToken();
      this.onHide();
    },
    async logout() {
      debugger;
      this.showLoading(true, "Kijelentkezés...");
      const response = await authenticationService.signOut();
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba kijelentkezéskor",
          "Nem sikerült kijelentkeztetni a felhasználót.",
          response.data
        );
      }

      authenticationService.redirectSignIn();
    },
  },
  mounted() {
    EventBus.$on("show-idle-modal", this.onShow);
    EventBus.$on("hide-idle-modal", this.onHide);
  },
  beforeDestroy() {
    EventBus.$off("show-idle-modal", this.onShow);
    EventBus.$off("hide-idle-modal", this.onHide);
  },
};
</script>