<template>
  <div class="ClientLayout">
    <Header />

    <slot />

    <Footer />
  </div>
</template>

<style scoped lang="scss">
.ClientLayout {
  background-color: #f5f5f5;
}
</style>
