<template>
  <div>
    <nav class="navigation">
      <div class="container">
        <a class="navigation__logo" href="#!">eXFinance</a>
      </div>
    </nav>
    <div class="auth login">
      <router-view />
    </div>
  </div>
</template>

<script>
import messages from '@/utils/messages'

export default {
  computed: {
    error() {
      return this.$store.getters.error
    },
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError].code || 'Что-то пошло не так')
    }
  }
}
</script>