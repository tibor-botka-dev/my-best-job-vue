<template>
  <div>
    <navbar />

    <main class="container">
      <div class="row mt-5 justify-content-center">
        <router-view class="pb-3 text-light"></router-view>

        <loading />
      </div>
    </main>
  </div>
</template>

<script>
import navbar from "./components/navbar";
import loading from "./components/loading";
import initService from "./services/init-service";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    navbar,
    loading
  },
  computed: {
    ...mapState(["initialized"])
  },
  methods: {
    ...mapMutations(["setInit"]),
    async initialize() {
      this.showLoading(true, this.$t("Adatok betöltése..."));
      const response = await initService.initApp();
      this.showLoading();

      if (!response?.status?.toString().startsWith("20"))
        this.showToast(
          this.$t("Hiba az adatok betöltésekor"),
          this.$t("Adatok betöltése nem sikerült"),
          response.data
        );
    }
  },
  async mounted() {
    if (!this.initialized)
      await this.initialize();
  }
};
</script>