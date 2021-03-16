<template>
  <div class="container">
    <div class="app-page">
      <div class="app-page__top">
        <h3 class="app-page__title">Счет</h3>
        <button class="button button--primary app-page__button" @click.prevent="refresh">
          <svg class="app-page__button-refresh" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <use xlink:href="../assets/img/svg/sprite/sprite.svg#refresh"></use>
          </svg>
        </button>
      </div>
      <Loader v-if="loading"/>
      <div class="row" v-else>
        <div class="col-12 col-md-5 app-page__col-content">
          <Bill :rates="currency.conversion_rates"/>
        </div>
        <div class="col-12 col-md-7">
          <Currency :rates="currency.conversion_rates" :date="currency.time_last_update_utc"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bill from '@/components/Bill'
import Currency from '@/components/Currency'
import Loader from '@/components/app/Loader'

export default {
  metaInfo() {
    return {
      title: "Главная"
    }
  },
  name: 'Home',
  data: () => ({
    currency: null,
    loading: true
  }),
  async mounted() {
    try {
      this.currency = await this.$store.dispatch('fetchCurrency')
      this.loading = false
      
      if (this.currency['result'] === 'error') {
        this.$message(this.currency['extra-info'])
      }
    } catch (err) {
      throw err
    }
  },
  methods: {
    async refresh() {
      this.loading = true
      this.currency = await this.$store.dispatch('fetchCurrency')
      this.loading = false
    }
  },
  components: {
    Bill,
    Currency,
    Loader
  }
}
</script>
