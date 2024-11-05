<template>
  <div>
    <img alt="Vue logo" src="../assets/img/logo.png" />
    <ul>
      <strong>My best job honlapja!</strong>
      <br>
      Ide jöhet egy leírás rólad és a honlapról:
      <li>?rövid bemutatkozás?</li>
      <li>?elérhetőségek?</li>
      <li>mire lehet használni a honlapot</li>
      <li>kiknek készült</li>
      <li>oldalakon miket lehet csinálni</li>
      <li>suliról infó</li>
    </ul>
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