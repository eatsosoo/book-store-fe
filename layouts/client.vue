<template>
  <div class="ClientLayout">
    <Header />

    <div class="Main">
      <slot />
    </div>

    <Footer />

    <ChatBot />
  </div>
</template>

<style scoped lang="scss">
.ClientLayout {
  background-color: #f5f5f5;
}
.Main {
  min-height: calc(100vh - 456px);
}
</style>
