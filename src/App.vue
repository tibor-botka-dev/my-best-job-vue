<template>
  <div>
    <!-- <loading /> -->

    <navbar />

    <!-- <main class="container-fluid mt-3">
      <router-view></router-view>
    </main> -->
    <router-view></router-view>

    <!-- <footer-panel /> -->
  </div>
</template>

<script>
import navbar from "./components/navbar";
import loading from "./components/loading";
import footerPanel from "./components/footer-panel";
import initService from "./services/init-service";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    navbar,
    loading,
    footerPanel
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
          response?.data || this.$t("A szerver nem elérhető")
        );
    }
  },
  async mounted() {
    if (!this.initialized)
      await this.initialize();
  }
};
</script>