<template>
    <div v-if="url" class="form-group text-center">
        <a :href="url" class="btn btn-lg btn-primary d-inline-flex">
            <i class="fab fa-google pb-2 text-success"></i>
            <h5>{{ text }}</h5>
        </a>
    </div>
</template>

<script>
export default {
    name: "google-button",
    props: ["url", "text", "tooltip"],
};
</script>