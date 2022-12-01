<template>
  <div class="container page-not-found-container">
    <h1 class="page-not-found-container-heading mb-4">Page Not Found</h1>


    <img src="../../assets/images/unknown.png" class="page-not-found-container-image" />


    <router-link :to="`/`" class="btn btn-primary mt-4 customer-actions">
      Back
    </router-link>
  </div>
</template>



<script>
export default {
  name: 'NotFound',
  props: {}
}
</script>

<style scoped>
.page-not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: -60px;
  height: 100vh;
}

.page-not-found-container-image {
  max-width: 30rem;
  width: 100%;
}
</style>