<template>
  <div class="container">
    <div class="app-page">
      <div class="app-page__top">
        <h3 class="app-page__title">Планирование</h3>
        <div class="app-page__current-balance">{{ info.bill | currency('RUB') }}</div>
      </div>
      <Loader v-if="loading"/>
      <div class="row" v-else>
        <div class="col-12">
          <div class="progress-boxes" v-if="categories.length">
            <div 
              class="progress-box" 
              :class="[category.progressColor]"  
              v-for="category in categories" 
              :key="category.id"
          >
              <div class="progress-box__content">
                <div class="progress-box__info info">
                  <div class="progress-box__info-category">{{ category.title }}</div>
                  <div class="progress-box__info-limit">{{ category.spend | currency }} из {{ category.limit | currency }}</div>
                </div>
                <div class="progress-box__progress" ref="progress" :data-tooltip="category.tooltip">
                  <div class="progress-box__progress-line" :style="{width: category.progressPercent + '%'}"></div>
                </div>
              </div>
            </div>
          </div>
          <p v-else>Запланированных записей пока нет</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import currencyFilter from '@/filters/currency.filter.js'
import Loader from '@/components/app/Loader'

import Tooltip from '@/assets/js/modules/tooltip'

export default {
  name: 'Planning',
  metaInfo() {
    return {
      title: "Планирование"
    }
  },
  data: () => ({
    loading: true,
    categories: [],
    tooltips: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  components: {
    Loader
  },
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')

    this.categories = categories.map((category, index) => {
      const spend = records
        .filter(record => record.categoryId === category.id)
        .filter(record => record.type === 'outcome')
        .reduce((total, record) => {
          return total += +record.sum
        }, 0)

        const percent = 100 * spend / category.limit
        const progressPercent = percent > 100 ? 100 : percent
        const progressColor = percent < 60 ? 'green' : percent < 100 ? 'yellow' : 'red'
        const tooltipValue = category.limit - spend
        const tooltip = `${tooltipValue < 0 ? 'Превышение на' : 'Осталось'} ${currencyFilter(Math.abs(tooltipValue))}`

        return {
          ...category,
          progressPercent,
          progressColor,
          spend,
          tooltip
        }
    })

    setTimeout(() => {
      const lines = this.$refs.progress
      if (lines) {
        lines.forEach(line => {
          const instance = Tooltip.init(line)
          this.tooltips.push(instance)
        })
      }
    })

    this.loading = false
  },
  destroyed() {
    this.tooltips.forEach(tooltip => {
      if (tooltip && tooltip.destroy) {
        tooltip.destroy()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
  .progress-boxes {
    max-height: 600px;
    padding-right: 10px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 10px;
    }

    &::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      border-radius: 5px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background-color: rgba(21, 101, 216, 0.4);
      box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    &::-webkit-scrollbar-thumb:window-inactive {
      background: rgba(21, 101, 216, 0.4);
    }
  }
</style>