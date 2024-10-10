<template>
  <div class="text-center">
    <h1>
      <span class="status-code text-danger">4</span>
      <span class="status-code text-highlight">0</span>
      <span class="status-code text-danger">4</span>
    </h1>

    <h2 class="text-weight-bold text-light poppins">
      Oops, a keresett oldal nem található
    </h2>

    <div class="row mt-3">
      <div class="col-md-4">
        <router-link :to="{ name: 'sign-in' }" class="btn btn-primary btn-lg">
          <i class="fas fa-sign-in mr-1"></i>Bejelentkezés
        </router-link>
      </div>

      <div class="offset-md-4 col-md-4 text-center mt-3 mt-sm-0">
        <router-link :to="{ path: $store.state.route.from.fullPath }" class="btn btn-secondary btn-lg">
          <i class="fas fa-undo-alt mr-1"></i>Vissza
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "Az oldal nem található"
    };
  },
};
</script>