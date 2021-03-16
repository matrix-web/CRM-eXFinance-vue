<template>
  <div id="app" ref="app" class="app left right">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>

<script>
import EmptyLayout from '@/layouts/EmptyLayout'
import MainLayout from '@/layouts/MainLayout'
import NotFoundLayout from '@/layouts/NotFoundLayout'

export default {
  name: 'app',
  data: () => ({
    app: null,
    overlayActive: false,
    isOverlay: false
  }),
  computed: {
    layout() {
      return (this.$route.meta.layout || 'empty' || 'not-found') + '-layout'
    }
  },
  components: {
    EmptyLayout,
    MainLayout,
    NotFoundLayout
  }
}
</script>

<style lang="scss">
@import "./assets/css/main.css";

.app {
  height: 100%;
}

.app.right {
  touch-action: pan-right;
}

.app.left {
  touch-action: pan-left;
}

.app.left.right {
  touch-action: pan-y;
}
</style>
