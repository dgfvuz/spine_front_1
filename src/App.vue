<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import router from './router';
onMounted(() => {
  router.push('/login')
})
</script>

<template>
    <RouterView />
</template>
