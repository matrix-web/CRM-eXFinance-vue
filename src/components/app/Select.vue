<template>
  <div class="input-field">
    <div class="select" role="select" :class="{open: isOpen}" @click="isOpen = !isOpen">
      <div class="select__backdrop" data-type="backdrop"></div>
      <div :class="['select__input', selectInputClass]" data-type="input" aria-label="select-input" tabindex="0">
        <span data-type="value" v-if="!current">{{ placeholder }}</span>
        <span data-type="value" v-else>{{ current.value }}</span>
        <svg 
          class="select__icon" 
          data-type="arrow" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink"
          :class="{'arrow-rotate': isOpen}"
        >
          <use xlink:href="../../assets/img/svg/sprite/sprite.svg#arrow-down"></use>
        </svg>
      </div>
      <div :class="['select__dropdown', dropDownClass]" aria-label="dropdown">
        <ul :class="['select__list', dropdownListClass]" @click="select">
          <li 
            :class="['select__item', selectItemClass, {selected: item.selected}]"
            aria-label="select-item" 
            data-type="item" 
            :data-id="item.id"
            v-for="item in selectItems"
            :key="item.id"
          >
          {{ item.value }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      isOpen: false,
      selectedItemId: null,
      current: null
    }),
    watch: {
      items(value) {
        if (value && this.defaultSelectedId) {
          this.current = this.selectItems.find(item => item.id === this.defaultSelectedId)
          this.current.selected = true

          this.$emit('selected', this.current)
        }
      },
      defaultSelectedId(value) {
        if (value) {
          this.current = this.selectItems.find(item => item.id === this.defaultSelectedId)
          this.current.selected = true
        } else {
          this.current = null
        }
      }
    },
    methods: {
      select(event) {
        const target = event.target
        this.selectedItemId = target.dataset.id
        this.selectItems.forEach(item => item.selected = false)
        this.current = this.selectItems.find(item => item.id === this.selectedItemId)
        this.current.selected = true

        this.$emit('selected', this.current)
      }
    },
    computed: {
      selectItems() {
        return this.items.map(item => ({...item, selected: false}))
      }
    },
    props: {
      items: {
        type: Array,
        required: true
      },
      defaultSelectedId: {
        type: String
      },
      selectInputClass: {
        type: String
      },
      dropDownClass: {
        type: String
      },
      selectItemClass: {
        type: String
      },
      placeholder: {
        type: String,
        default: ''
      },
      dropdownListClass: {
        type: String
      }
    },
    mounted() {
      if (this.defaultSelectedId) {
        this.current = this.selectItems.find(item => item.id === this.defaultSelectedId)
        this.current.selected = true

        this.$emit('selected', this.current)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .arrow-rotate {
    transform: rotate(180deg);
  }
</style>