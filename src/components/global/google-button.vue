<template>
    <div v-if="url" class="text-center">
        <a :href="url" class="btn btn-lg btn-primary d-inline-flex align-items-center">
            <img src="../../assets/img/social/google.svg" alt="Google login button" />
            <!-- <i class="fab fa-google pb-2 text-success"></i> -->
            <span class="ml-3">{{ text }}</span>
        </a>
    </div>
</template>

<script>
export default {
    name: "google-button",
    props: ["url", "text", "tooltip"],
};
</script>