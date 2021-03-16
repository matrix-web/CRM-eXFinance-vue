<template>
  <Loader v-if="loading"/>
  <div class="app-main-layout" v-else :class="pageClass">
    <nav class="navigation app-navigation">
      <button @click.prevent="logout" aria-label="button-logout" class="button-logout" data-logout data-position="left" data-tooltip="Выход">
        <svg class="button-logout__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <use xlink:href="../assets/img/svg/sprite/sprite.svg#logout"></use>
        </svg>
      </button>
    </nav>
    <Sidebar 
      @toggle-sidebar="sidebarIsToggle = !sidebarIsToggle"
      @page-change="closeSidebarWhenNav"
      @click-closed="closeMobileSidebar"
      :sidebarIsToggle="sidebarIsToggle"
      :sidebarActive="sidebarActive"
    />
    <main ref="main" @swipe="openMobileSidebar" class="app-content right left">
      <router-view />
    </main>
    <router-link class="button-add" aria-label="add-record" to="/record" data-poisition="top" data-tooltip="Добавить запись">
      <svg class="button-add__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <use xlink:href="../assets/img/svg/sprite/sprite.svg#add"></use>
      </svg>
    </router-link>
  </div>
</template>

<script>
import { swipe } from '@/assets/js/modules/swipeEvent'
import Loader from '@/components/app/Loader'
import Sidebar from '@/components/app/Sidebar'
import messages from '@/utils/messages'

export default {
  data: () => ({
    sidebarIsToggle: false,
    mediaQuery: null,
    mediaMatched: false,
    loading: true,
    main: null,
    sidebar: null,
    app: null,
    sidebarActive: false
  }),
  methods: {
    async logout() {
      await this.$store.dispatch('logout')
      this.$router.push('/login?message=logout')
    },
    openMobileSidebar(e) {
      if (e.detail.dir === 'right' && !this.mediaMatched) {
        this.app.classList.add('overlay')
        setTimeout(() =>  this.app.classList.add('overlay-active'), 200)
        this.sidebarActive = true
      }
    },
    closeSidebarWhenNav() {
      this.sidebarActive = false

      setTimeout(() => this.app.classList.remove('overlay-active'), 200)
      setTimeout(() => this.app.classList.remove('overlay'), 400)
    },
    closeMobileSidebar(e) {
      if (e.detail.dir === 'left' && !this.mediaMatched) {
        this.sidebarActive = false

        setTimeout(() => this.app.classList.remove('overlay-active'), 200)
        setTimeout(() => this.app.classList.remove('overlay'), 400)
      } 

      if (e.target.dataset.close) {
        this.sidebarActive = false

        setTimeout(() => this.app.classList.remove('overlay-active'), 200)
        setTimeout(() => this.app.classList.remove('overlay'), 400)
      }
    }
  },
  computed: {
    pageClass() {
      return {
        'app-main-layout--sidebar-mini': this.sidebarIsToggle && this.mediaMatched
      }
    },
    error() {
      return this.$store.getters.error
    },
    info() {
      return this.$store.getters.info
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || 'Что-то пошло не так')
    },
    locale(value) {
      this.$store.commit('setInfo', {...this.info, locale: value})
    }
  },
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }

    setTimeout(() => {
      this.main = this.$refs.main
      this.app = this.main.parentElement.parentElement
      this.sidebar = this.main.previousElementSibling
      
      swipe(this.app, {
        maxTime: 1000, 
        minTime: 100, 
        maxDist: 150, 
        minDist: 60
      })

      swipe(this.main, {
        maxTime: 1000, 
        minTime: 100, 
        maxDist: 150, 
        minDist: 60
      })

      this.mediaQuery = window.matchMedia('(min-width: 1100px)')
      this.mediaMatched = this.mediaQuery.matches

      if (this.mediaMatched) {
        this.main.removeEventListener('swipe', this.openMobileSidebar)
        this.app.removeEventListener('swipe', this.closeMobileSidebar)
      }

      this.app.addEventListener('swipe', this.closeMobileSidebar)
    })

    this.loading = false
  },
  components: {
    Sidebar,
    Loader
  }
}
</script>

<style lang="scss">
  .language-select-input {
    height: 35px !important;
  }
  .language-dropdown {
    top: 35px !important;
  }
  .language-item {
    padding: .313rem 1rem !important;
  }
</style>