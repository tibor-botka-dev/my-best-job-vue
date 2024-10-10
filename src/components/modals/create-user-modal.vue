<template>
  <b-modal class="modal" id="user-modal" ref="user-modal" :title="title" header-bg-variant="primary"
    header-class="text-light" body-bg-variant="dark" body-text-variant="light" footer-bg-variant="dark" :centered="true"
    hide-header-close no-close-on-esc no-close-on-backdrop>
    <div class="row">
      <div class="col-md-12">
        <div class="form-group">
          <label for="last-name">
            Vezetéknév
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="last-name" class="form-control" v-model="userData.lastName" required />
          <input-footer :validation="validationMessages.lastName" message="Vezetéknév mező kötelező"
            tooltip="1-30 karakter hosszú lehet" />
        </div>

        <div class="form-group">
          <label for="first-name">
            Keresztnév
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="first-name" class="form-control" v-model="userData.firstName" required />
          <input-footer :validation="validationMessages.firstName" message="Keresztnév mező kötelező"
            tooltip="1-30 karakter hosszú lehet" />
        </div>

        <div class="form-group">
          <label for="email">
            Email cím
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="email" type="email" class="form-control" v-model="userData.email" required />
          <input-footer :validation="validationMessages.email" message="Email cím mező kötelező"
            tooltip="Érvényes email címnek kell lennie" />
        </div>

        <div>
          <label for="photo">Profilkép</label>
          <div class="row align-items-center">
            <div class="col-md-6 form-group">
              <b-form-file id="photo" v-model="userData.newAvatar" accept=".jpg, .png, .gif" :state="avatarIsValid"
                placeholder="Válasszon egy képet vagy húzza ide..." drop-placeholder="Húzza ide...">
              </b-form-file>
            </div>
            <div v-if="avatarPreview" class="col-md-3 text-center form-group">
              <b-avatar :src="avatarPreview" class="no-mask-image ml-auto preview-avatar" size="lg" rounded></b-avatar>
            </div>
            <div class="col-md-3 text-center form-group">
              <button :disabled="!userData.newAvatar" class="btn btn-danger" @click="deleteAvatar">
                <i class="fas fa-trash-alt"></i>
                Kép törlése
              </button>
            </div>
          </div>
          <input-footer :validation="validationMessages.newAvatar" message="Profilkép érvénytelen, így nem lesz mentve"
            tooltip="Jpg, png, gif kiterjesztésű képet tölthet fel maximum 5MB méretben" />
        </div>

        <div class="form-group">
          <label for="role">
            Szerepkör
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <b-form-checkbox-group v-model="userData.roles" :options="mappedRoles" switches></b-form-checkbox-group>
          <input-footer :validation="validationMessages.roles" message="Szerepkör kiválasztása kötelező" />
        </div>
      </div>
    </div>
    <template #modal-footer>
      <div class="mx-auto">
        <button class="btn btn-secondary mr-5" @click="onHide">
          <i class="fas fa-undo mr-1"></i>Mégse
        </button>
        <button class="btn btn-primary" @click="editOrCreate">
          <i :class="`fas fa-${userData.id ? 'edit' : 'plus'} mr-1`"></i>
          {{ saveButtonTitle }}
        </button>
      </div>
    </template>
  </b-modal>
</template>

<script>
import { EventBus } from "../../stuff/event-bus";
import { mapState } from "vuex";

export default {
  data() {
    return {
      title: "Új felhasználó létrehozása",
      mappedRoles: [],
      userData: {
        id: null,
        lastName: null,
        firstName: null,
        email: null,
        newAvatar: null,
        roles: [],
      },
      submitted: null,
    };
  },
  computed: {
    ...mapState(["roles"]),
    saveButtonTitle() {
      if (this.userData.id)
        return "Módosítás";
      else
        return "Létrehozás";
    },
    avatarPreview() {
      if (!this.userData.newAvatar)
        return null;

      var result = URL.createObjectURL(this.userData.newAvatar);
      return result;
    },
    avatarIsValid() {
      if (!this.userData.newAvatar)
        return true;

      var result = this.userData.newAvatar.size <= 1024 * 1024 * 5 &&
        this.userData.newAvatar.type.startsWith("image/");
      return result;
    },
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["lastName"] = !this.userData.lastName || !this.regexPatterns.name.test(this.userData.lastName);
      result["firstName"] = !this.userData.firstName || !this.regexPatterns.name.test(this.userData.firstName);
      result["email"] = !this.regexPatterns.email.test(this.userData.email);
      result["roles"] = !this.userData.roles.length;
      result["newAvatar"] = !this.avatarIsValid;

      return result;
    },
  },
  methods: {
    onShow(e) {
      this.submitted = null;

      this.mappedRoles = this.roles.map(x => {
        return {
          text: x.name,
          value: x.id,
        };
      });

      if (e?.user)
        this.userData = e.user;

      this.$refs["user-modal"].show();
    },
    onHide() {
      this.$refs["user-modal"].hide();
    },
    editOrCreate() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      EventBus.$emit(`${this.userData.id ? 'edited' : 'created'}-user`, {
        user: this.userData
      });
    },
    deleteAvatar() {
      this.userData.newAvatar = null;
    },
  },
  mounted() {
    this.setTitle();
    EventBus.$on("show-user-modal", this.onShow);
    EventBus.$on("hide-user-modal", this.onHide);
  },
  beforeDestroy() {
    EventBus.$off("show-user-modal", this.onShow);
    EventBus.$off("hide-user-modal", this.onHide);
  },
};
</script>