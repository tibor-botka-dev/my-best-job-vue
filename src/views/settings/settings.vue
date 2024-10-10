<template>
  <div class="row">
    <div class="col">
      <b-tabs v-model="tabIndex" pills card content-class="mt-3" fill active-nav-item-class="font-weight-bold"
        nav-class="h5 text-danger">
        <b-tab title="Felhasználók" title-link-class="text-light">
          <user-setting />
        </b-tab>
        <b-tab title="Automatikus kijelentkeztetés" title-link-class="text-light">
          <idle-setting />
        </b-tab>
        <b-tab title="Email" title-link-class="text-light">
          <email-setting />
        </b-tab>
        <b-tab title="Email sablonok" title-link-class="text-light">
          <email-template />
        </b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import userSetting from "./user-setting";
import idleSetting from "./idle-setting";
import emailSetting from "./email-setting";
import emailTemplate from "./email-template";

export default {
  components: {
    userSetting,
    idleSetting,
    emailSetting,
    emailTemplate
  },
  data() {
    return {
      title: "Admin beállítások",
      tabIndex: null,
    };
  },
  mounted() {
    this.setTitle();
  },
};
</script>