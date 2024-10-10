<template>
  <div>
    <b-table v-if="users.length" striped bordered hover responsive no-border-collapse head-variant="dark"
      table-variant="primary" tbody-class="font-weight-bold" :items="users" :fields="fields">
      <template #cell(roles)="user">
        <ol class="mb-auto">
          <li v-for="role in user.item.roles" v-bind:key="role">
            {{ roles.find((x) => x.id == role).name }}
          </li>
        </ol>
      </template>

      <template #cell(avatar)="user">
        <b-avatar v-if="user.item.avatar" class="no-mask-image" variant="primary" size="lg"
          :src="user.item.avatar"></b-avatar>
        <b-avatar v-else variant="primary" size="lg">
          <i class="fas fa-user-tie fa-lg"></i>
        </b-avatar>
      </template>

      <template #cell(actions)="user">
        <div class="btn-group-vertical">
          <button class="btn btn-sm btn-primary" @click="edit(user.item)">
            <i class="fas fa-edit mr-1"></i>
            Módosítás
          </button>
          <button class="btn btn-sm btn-danger" @click="deleteUser(user.item.id)">
            <i class="fas fa-trash-alt"></i>
            Törlés
          </button>
        </div>
      </template>
    </b-table>
    <h4 v-else class="text-center">
      <strong>Nem található felhasználó az adatbázisban.</strong>
    </h4>

    <div class="mt-4 text-center">
      <button type="button" class="btn btn-lg btn-primary" @click="create">
        <i class="fas fa-user"></i>
        Új felhasználó létrehozása
      </button>
    </div>

    <create-user-modal />
  </div>
</template>

<script>
import createUserModal from "@/components/modals/create-user-modal";
import userService from "../../services/user-service";
import { EventBus } from "../../stuff/event-bus";
import { mapState } from "vuex";

export default {
  components: {
    createUserModal
  },
  data() {
    return {
      users: [],
      submitted: null,
      fields: [
        {
          key: "lastName",
          label: "Vezetéknév",
          sortable: true,
        },
        {
          key: "firstName",
          label: "Keresztnév",
          sortable: true,
        },
        {
          key: "fullName",
          label: "Teljes név",
          sortable: true,
        },
        {
          key: "email",
          label: "Email",
          sortable: true,
        },
        {
          key: "roles",
          label: "Szerepkör",
        },
        {
          key: "avatar",
          label: "Avatar"
        },
        {
          key: "actions",
          label: "Műveletek",
          tdClass: "text-right",
        }
      ],
    };
  },
  computed: {
    ...mapState(["initialized", "roles"]),
  },
  methods: {
    async initialize() {
      this.showLoading(true, "Felhasználók betöltése...");
      const response = await userService.getUsers();
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba a felhasználók betöltésekor",
          "Felhasználók betöltése nem sikerült",
          response.data
        );

        return;
      }

      this.users = response.data?.users;
    },
    async create() {
      EventBus.$emit("show-user-modal");
    },
    async onCreated(e) {
      this.showLoading(true, "Felhasználó mentése...");
      const response = await userService.createUser(e.user);
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba a felhasználó mentésekor",
          "A felhasználó mentése sikertelen",
          response.data
        );

        return;
      }

      this.showToast(
        "Felhasználó mentése sikeres",
        "Fiók aktiváló email kiküldve a felhasználónak.",
        null,
        { variant: "success" }
      );

      EventBus.$emit("hide-user-modal");

      await this.initialize();
    },
    async edit(user) {
      const editUser = Object.assign({}, user);
      delete editUser.fullName;

      EventBus.$emit("show-user-modal", {
        user: editUser
      });
    },
    async onEdited(e) {
      this.showLoading(true, "Felhasználó módosítása...");

      const formData = new FormData();
      formData.append("id", e.user.id);
      formData.append("avatar", e.user.newAvatar);
      formData.append("firstName", e.user.firstName);
      formData.append("lastName", e.user.lastName);
      formData.append("email", e.user.email);

      const response = await userService.editUser(formData);
      this.showLoading();

      if (!response.isSuccessStatusCode) {
        this.showToast(
          "Hiba a felhasználó módosításakor",
          "A felhasználó módosítása sikertelen",
          response.data
        );

        return;
      }

      this.showToast(
        "Felhasználó módosítása sikeres",
        "A felhasználó adatai sikeresen frissítve.",
        null,
        { variant: "success" }
      );

      EventBus.$emit("hide-user-modal");

      await this.initialize();
    },
    async deleteUser(id) {
      this.showLoading(true, "Felhasználó törlése...");
      const response = await userService.deleteUser(id);
      this.showLoading();

      if (response.isSuccessStatusCode) {
        await this.initialize();

        return;
      }

      this.showToast(
        "Hiba a felhasználó törlésekor",
        "A felhasználó törlése sikertelen",
        response.data
      );
    },
  },
  mounted() {
    EventBus.$on("created-user", this.onCreated);
    EventBus.$on("edited-user", this.onEdited);
  },
  beforeDestroy() {
    EventBus.$off("created-user", this.onCreated);
    EventBus.$off("edited-user", this.onEdited);
  },
  watch: {
    async initialized(newValue, oldValue) {
      if (newValue && newValue != oldValue)
        await this.initialize();
    },
  },
};
</script>