<template>
  <div class="card">
    <div class="card__top">
      <h3 class="card__title">Текущий баланс</h3>
    </div>
    <div class="card__content">
      <div class="items">
        <p 
          class="items__item"
          v-for="cur in currencies"
          :key="cur"
        >{{getCurrency(cur) | currency(cur)}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    currencies: ['RUB', 'USD', 'EUR']
  }),
  computed: {
    base () {
      return this.$store.getters.info.bill / (this.rates['RUB'] / this.rates['USD'])
    }
  },
  methods: {
    getCurrency(currency) {
      return Math.floor(this.base * this.rates[currency])
    }
  },
  props: {
    rates: {
      type: Object,
      required: true
    }
  }
}
</script>