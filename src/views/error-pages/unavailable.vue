<template>
  <div class="text-center">
    <h1>
      <span class="status-code text-danger">5</span>
      <span class="status-code text-highlight">0</span>
      <span class="status-code text-danger">3</span>
    </h1>

    <h2 class="text-weight-bold text-light poppins">
      Oops, a szerver nem elérhető
    </h2>

    <h5 class="text-light poppins">
      Kérem várjon! Próbálja meg később vagy lépjen a <br>
      <router-link :to="{ name: 'home' }" class="text-center btn btn-primary btn-lg mt-2">
        <i class="fas fa-sign-in mr-1"></i>Főoldalra
      </router-link>
    </h5>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "A webszerver nem elérhető"
    };
  },
};
</script>