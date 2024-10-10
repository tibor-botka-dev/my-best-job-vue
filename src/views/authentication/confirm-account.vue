<template>
  <div>
    <div class="card-body pt-3">
      <h5 class="text-center text-light">
        <strong class="text-info">'{{ this.email }}'</strong>
        <p v-if="!confirmed">
          email címét nem sikerült megerősíteni.<br />Kérjük, próbálja meg később.
        </p>
        <p v-else>
          email címe sikeresen meg lett erősítve.<br />Kérjük jelentkezzen be.
          <br />
          <router-link :to="{ name: 'sign-in' }" class="btn btn-primary btn-lg mt-3">
            <i class="fas fa-sign-in"></i> Bejelentkezés
          </router-link>
        </p>
      </h5>
    </div>
  </div>
</template>

<script>
import authenticationService from "../../services/authentication-service";
import { mapState } from "vuex";

export default {
  data() {
    return {
      title: "Regisztráció véglegesítése",
      email: null,
      confirmed: null,
    };
  },
  computed: {
    ...mapState(["initialized"]),
  },
  methods: {
    async confirmAccount(params) {
      if (!params.email || !params.token)
        return;

      this.email = params.email;

      this.showLoading(true, "Email hitelesítése...");
      const response = await authenticationService.confirmAccount({
        email: params.email,
        token: params.token,
      });
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba történt email címének hitelesítése közben",
          "Az email cím hitelesítése sikertelen",
          response.data
        );

        return;
      }

      this.confirmed = true;
    },
  },
  mounted() {
    this.setTitle();
  },
  watch: {
    async initialized(newValue, oldValue) {
      if (newValue && newValue != oldValue)
        await this.confirmAccount(this.$route.params);
    },
  },
};
</script>