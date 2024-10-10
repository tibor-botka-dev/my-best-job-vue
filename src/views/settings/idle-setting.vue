<template>
  <div>
    <div class="row">
      <div class="offset-md-1 col-md-4">
        <div class="form-group">
          <label for="duration">
            Időtartam
            <span class="h4 text-danger">
              <strong>*</strong>
            </span>
          </label>
          <input id="duration" type="number" class="form-control" v-model="idleSettingData.duration"
            @keypress="checkNumber($event)" required />
          <input-footer :validation="validationMessages.duration" message="Időtartam mező kötelező"
            tooltip="Visszaszámlás ideje másodpercben(1-1800 közötti szám lehet)" />
        </div>

        <div class="form-group">
          <label for="reminder">Értesítés</label>
          <input id="reminder" type="number" class="form-control" v-model="idleSettingData.reminder"
            @keypress="checkNumber($event)" />
          <input-footer :validation="validationMessages.reminder"
            message="Kisebbnek kell lennie, mint az Időtartam mező"
            tooltip="Értesítés megjelenítése adott másodpercnél(1-1800 közötti szám lehet)" />
        </div>

        <div class="form-group">
          <label for="wait">Várakoztatás</label>
          <input id="wait" type="number" class="form-control" v-model="idleSettingData.wait"
            @keypress="checkNumber($event)" />
          <input-footer :validation="validationMessages.wait" message="0-60 közötti szám lehet"
            tooltip="Visszaszámlálás indításának várakoztatása adott másodpercig" />
        </div>
      </div>
      <div class="offset-md-1 col-md-4">
        <div class="form-group">
          <label for="in-background">Óra elrejtése?</label>
          <div class="custom-switch form-control bg-transparent border-0">
            <input type="checkbox" class="custom-control-input custom-control-lg" id="in-background"
              v-model="idleSettingData.inBackground" />
            <label class="custom-control-label" for="in-background"></label>
          </div>
          <input-footer tooltip="Visszaszámláló óra elrejtése?" />
        </div>

        <div class="form-group">
          <label for="loop">Ismétlődjön?</label>
          <div class="custom-switch form-control bg-transparent border-0">
            <input type="checkbox" class="custom-control-input custom-control-lg" id="loop"
              v-model="idleSettingData.loop" />
            <label class="custom-control-label" for="loop"></label>
          </div>
          <input-footer tooltip="Visszaszámláló óra ismétlődjön?" />
        </div>

        <div class="form-group">
          <label for="turned-on">Bekapcsolva legyen?</label>
          <div class="custom-switch form-control bg-transparent border-0">
            <input type="checkbox" class="custom-control-input custom-control-lg" id="turned-on"
              v-model="idleSettingData.turnedOn" />
            <label class="custom-control-label" for="turned-on"></label>
          </div>
          <input-footer tooltip="Visszaszámláló óra bekapcsolva legyen?" />
        </div>
      </div>
    </div>
    <div class="mt-5 text-center">
      <button type="button" class="btn btn-lg btn-primary" @click="update">
        <i class="fas fa-stopwatch"></i>
        Kijelentkezési beállítások mentése
      </button>
    </div>
  </div>
</template>

<script>
import settingService from "../../services/setting-service";
import { mapState } from "vuex";

export default {
  data() {
    return {
      idleSettingData: {
        id: null,
        creatorUserId: null,
        duration: null,
        reminder: null,
        wait: null,
        loop: null,
        inBackground: null,
        turnedOn: null
      },
      submitted: null,
    };
  },
  computed: {
    ...mapState(["initialized", "idleSetting"]),
    validationMessages() {
      var result = [];
      if (!this.submitted)
        return result;

      result["duration"] = !this.idleSettingData.duration ||
        !this.regexPatterns.duration.test(this.idleSettingData.duration);
      result["reminder"] = this.idleSettingData.reminder &&
        (this.idleSettingData.reminder >= this.idleSettingData.duration ||
          !this.regexPatterns.duration.test(this.idleSettingData.reminder));
      result["wait"] = this.idleSettingData.wait &&
        !this.regexPatterns.wait.test(this.idleSettingData.wait);

      return result;
    },
  },
  methods: {
    async initialize() {
      this.showLoading(true, "Automatikus kiléptetési beállítások betöltése...");
      Object.assign(this.idleSettingData, this.idleSetting);
      this.showLoading();
    },
    async update() {
      this.submitted = true;
      if (Object.values(this.validationMessages).includes(true))
        return;

      this.showLoading(true, "Automatikus kiléptetési beállítások mentése...");
      const response = await settingService.updateIdleSetting(this.idleSettingData);
      this.showLoading();

      if (response.isSuccessStatusCode) {
        this.$router.go();
      }

      this.showToast(
        "Hiba a beállítások mentése közben",
        "Automatikus kiléptetési beállítások mentése sikertelen",
        response.data
      );
    },
  },
  watch: {
    async initialized(newValue, oldValue) {
      if (newValue && newValue != oldValue) {
        await this.initialize();
      }
    },
  },
};
</script>