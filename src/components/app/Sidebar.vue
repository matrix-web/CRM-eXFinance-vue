<template>
  <aside class="sidebar" :class="{'mini-sidebar': sidebarIsToggle, 'sidebar--active': sidebarActive}">
    <div class="sidebar-content">
      <div class="sidebar__logo" :class="{'mini-sidebar__logo': sidebarIsToggle}">
        <a class="sidebar__logo-link" href="#!" v-if="!sidebarIsToggle">eXFinance</a>
        <button class="sidebar__close" data-close="true" @click="$emit('click-closed', $event)">&times;</button>
      </div>
      <div class="user" :class="{'mini-sidebar__user': sidebarIsToggle}">
        <router-link class="user__img" to="/profile" custom :class="{'mini-sidebar__user-img': sidebarIsToggle}">
          <img :src="info.avatar && info.avatar.url" :alt="`${info.firstName} ${info.lastName}`">
        </router-link>
        <div class="user__info" v-if="!sidebarIsToggle">
          <h4 class="user__title">{{info.firstName}} {{info.lastName}}</h4>
          <p class="user__email">{{info.email}}</p>
        </div>
      </div>
      <nav class="sidebar__nav" @click="$emit('page-change')" :class="{'mini-sidebar__nav': sidebarIsToggle}">
        <router-link 
          class="sidebar__nav-link"
          v-for="link in links"
          :key="link.url"
          :to="link.url"
          custom
        >
          <div ref="icons" :data-tooltip="link.title">
            <svg class="sidebar__nav-link-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :class="{'mini-sidebar__nav-link-icon': sidebarIsToggle}">
              <use :xlink:href="require('../../assets/img/svg/sprite/sprite.svg') + link.iconID"></use>
            </svg>
          </div>
          <span v-if="!sidebarIsToggle">{{link.title}}</span>
        </router-link>
      </nav>
    </div>
    <button @click="$emit('toggle-sidebar')" class="sidebar__toggle-button">
      <svg class="sidebar__toggle-button-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :class="{'mini-sidebar__toggle-button--active': sidebarIsToggle}">
        <use xlink:href="../../assets/img/svg/sprite/sprite.svg#toggle"></use>
      </svg>
      <span v-if="!sidebarIsToggle">Переключить панель</span>
    </button>
  </aside>
</template>

<script>
import Tooltip from '@/assets/js/modules/tooltip'

export default {
  data: () => ({
    links: [
      {title: 'Счет', url: '/', iconID: '#money'},
      {title: 'История', url: '/history', iconID: '#file'},
      {title: 'Планирование', url: '/planning', iconID: '#to-do-list'},
      {title: 'Новая запись', url: '/record', iconID: '#edit'},
      {title: 'Категории', url: '/categories', iconID: '#categories'}
    ],
    icons: [],
    tooltips: [],
  }),
  computed: {
    info() {
      return this.$store.getters.info
    }
  },
  methods: {
    changePage(event) {
      this.$emit('page-change')
    }
  },
  watch: {
    sidebarIsToggle(value) {
      if (value) {
        this.tooltips = this.icons.map(icon => Tooltip.init(icon))
      } else {
        this.tooltips.forEach(tooltip => {
          if (tooltip && tooltip.destroy) {
            tooltip.destroy()
          }
        })
      }
    },
    sidebarActive(value) {
      return value
    }
  },
  mounted() {
    this.icons = this.$refs.icons
  },
  props: {
    sidebarIsToggle: {
      type: Boolean,
      required: true
    },
    sidebarActive: {
      type: Boolean,
      required: true
    }
  }
}
</script>