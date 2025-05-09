<template>
  <div class="row py-5 text-center">
    <div class="col-12 col-md-5">
      <p class="font-weight-bold">{{ $t("Állást keres?") }}</p>
      <p>{{ $t('Találja meg az Ön igényeinek legmegfelelőbb állást AI segítségével.'
        + ' Adjon meg pár információt magáról és az AI segít feltérképezni, kiszűrni a legjobb állásokat.') }}</p>
      <button type="button" class="btn btn-lg btn-primary" @click="getJobs()">
        <i class="fas fa-search"></i>
        {{ $t("Állást keresek") }}
      </button>
    </div>

    <div class="col-12 col-md-2 mt-n5">
      <img class="w-100" src="../assets/img/logo.png" alt="My Best Job logo" />
    </div>

    <div class="col-12 col-md-5">
      <p class="font-weight-bold">{{ $t("Állást kínál?") }}</p>
      <p>{{ $t('Találja meg az Ön igényeinek legmegfelelőbb munkaerőt AI segítségével.'
        + ' Adjon meg pár információt cégéről és az AI segít megtalálni a legjobb munkaerőt.') }}</p>
      <button type="button" class="btn btn-lg btn-primary" @click="getJobs()">
        <i class="fas fa-upload"></i>
        {{ $t("Állást adok fel") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "Főoldal"
    };
  },
  mounted() {
    this.setTitle();
  }
};
</script>