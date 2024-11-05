<template>
  <figure>
    <small v-if="validation" class="m-0 form-text font-weight-bold text-danger">
      {{ message }}
    </small>
    <small v-if="tooltip" v-html="tooltip" class="m-0 form-text font-weight-bold text-primary"> </small>
  </figure>
</template>

<script>
export default {
  name: "input-footer",
  props: ["validation", "message", "tooltip"],
};
</script>