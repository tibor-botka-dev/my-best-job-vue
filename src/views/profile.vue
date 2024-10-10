<template>
  <div class="row">
    <div class="col-xl-6">
      <div class="form-group">
        <label for="lastName">
          Vezetéknév
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="lastName" class="form-control" v-model="profileData.lastName" required autocomplete="given-name" />
        <input-footer :validation="validationMessages.lastName" message="Vezetéknév mező kötelező"
          tooltip="1-30 karakter hosszú lehet" />
      </div>

      <div class="form-group row mb-0">
        <div class="col-md-12">
          <label>Teljes név</label>
          <p class="text-info">
            <strong>{{ profileData.fullName }}</strong>
          </p>
        </div>
      </div>

      <div class="form-group">
        <label for="email">
          Email cím
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="email" type="email" class="form-control" v-model="profileData.email" required autocomplete="email" />
        <a v-if="emailIsValid" class="h6 text-info" :href="`mailto:${profileData.email}`"><span class="text-success">{{
          profileData.email }}</span> címre email
          küldés</a>
        <input-footer :validation="validationMessages.email" message="Email cím mező kötelező"
          tooltip="Érvényes email címnek kell lennie" />
      </div>
    </div>

    <div class="col-xl-6">
      <div class="form-group">
        <label for="firstName">
          Keresztnév
          <span class="h4 text-danger">
            <strong>*</strong>
          </span>
        </label>
        <input id="firstName" class="form-control" v-model="profileData.firstName" required
          autocomplete="family-name" />
        <input-footer :validation="validationMessages.firstName" message="Keresztnév mező kötelező"
          tooltip="1-30 karakter hosszú lehet" />
      </div>

      <div class="form-group">
        <label for="photo">Profilkép</label>
        <div class="row">
          <div class="col-md-7">
            <b-form-file id="photo" v-model="profileData.newAvatar" accept=".jpg, .png, .gif" :state="avatarIsValid"
              placeholder="Válasszon egy képet vagy húzza ide..." drop-placeholder="Húzza ide...">
            </b-form-file>
          </div>
          <div class="col-md-3 text-center">
            <b-avatar v-if="avatarPreview" :src="avatarPreview" class="no-mask-image ml-auto preview-avatar" size="lg"
              rounded></b-avatar>
          </div>
          <div class="col-md-2 text-center">
            <button :disabled="!profileData.newAvatar" class="btn btn-danger" @click="deleteAvatar">
              <i class="fas fa-trash-alt"></i>
              Kép törlése
            </button>
          </div>
        </div>
        <input-footer :validation="validationMessages.newAvatar" message="Profilkép érvénytelen, így nem lesz mentve"
          tooltip="Jpg, png, gif kiterjesztésű képet tölthet fel maximum 5MB méretben" />
      </div>
    </div>

    <div class="col-md-6 d-flex align-items-center offset-md-3">
      <button :disabled="canSave" type="button" class="btn btn-lg btn-primary" @click="saveProfile()">
        <i class="fas fa-save"></i>
        Mentés
      </button>

      <b-avatar v-if="profileData.avatarBase64" :src="profileData.avatarBase64"
        class="no-mask-image ml-auto avatar-icon" size="10rem"></b-avatar>
    </div>
  </div>
</template>

<script>
import profileService from "../services/profile-service";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      title: "Személyes adatok",
      profileData: {
        lastName: null,
        firstName: null,
        fullName: null,
        email: null,
        newAvatar: null,
        avatar: null,
      },
      submitted: null
    };
  },
  computed: {
    ...mapState(["initialized"]),
    canSave() {
      var result = Object
        .values(this.validationMessages)
        .includes(true);

      return result;
    },
    avatarPreview() {
      if (!this.profileData.newAvatar)
        return null;

      var result = URL.createObjectURL(this.profileData.newAvatar);
      return result;
    },
    avatarIsValid() {
      if (!this.profileData.newAvatar)
        return true;

      var result = this.profileData.newAvatar.size <= 1024 * 1024 * 5 &&
        this.profileData.newAvatar.type.startsWith("image/");
      return result;
    },
    emailIsValid() {
      if (!this.profileData.email)
        return false;

      var result = this.regexPatterns.email.test(this.profileData.email);
      return result;
    },
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["lastName"] = !this.regexPatterns.name.test(this.profileData.lastName);
      result["firstName"] = !this.regexPatterns.name.test(this.profileData.firstName);
      result["email"] = !this.regexPatterns.email.test(this.profileData.email);
      result["newAvatar"] = !this.avatarIsValid;

      return result;
    },
  },
  methods: {
    ...mapMutations(["setAvatar"]),
    async initialize() {
      this.showLoading(true, "Személyes adatok betöltése...");
      const response = await profileService.getProfile();
      this.showLoading();

      if (response.isSuccessStatusCode) {
        this.profileData = response.data?.profile;

        return;
      }

      this.showToast(
        "Hiba a személyes adatok lekérdezésekor",
        "Személyes adatok lekérdezése nem sikerült",
        response.data
      );
    },
    async saveProfile() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Adatok mentése...");

      const formData = new FormData();
      formData.append("id", this.profileData.id);
      formData.append("avatar", this.profileData.newAvatar);
      formData.append("firstName", this.profileData.firstName);
      formData.append("lastName", this.profileData.lastName);
      formData.append("email", this.profileData.email);

      const response = await profileService.updateProfile(formData);
      this.showLoading();

      if (!response.statusCode?.toString().startsWith("20")) {
        this.showToast(
          "Hiba az adatok mentése során",
          "A személyes adatok mentése sikertelen",
          response.data
        );

        return;
      }

      const avatarResponse = await profileService.getAvatar();
      if (avatarResponse.statusCode?.toString().startsWith("20"))
        this.setAvatar(avatarResponse.data.avatar);

      this.submitted = false;
      this.showToast(
        "Személyes adatok mentése sikeres",
        "Személyes adatok frissítve.",
        { variant: "success" }
      );

      await this.initialize();
    },
    deleteAvatar() {
      if (!this.profileData.newAvatar)
        return;

      this.profileData.newAvatar = null;
    },
  },
  mounted() {
    this.setTitle();
  },
  watch: {
    async initialized(newValue, oldValue) {
      if (newValue && newValue != oldValue)
        await this.initialize();
    },
  },
};
</script>