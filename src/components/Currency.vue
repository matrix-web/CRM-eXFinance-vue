<template>
  <div class="card">
    <div class="card__top">
      <h3 class="card__title">Курс валют</h3>
    </div>
    <div class="card__content">
      <table class="table">
        <thead class="table-head">
          <tr class="table__row">
            <th>Валюта</th>
            <th>Курс</th>
            <th>Дата</th>
          </tr>
        </thead>
        <tbody>
          <tr class="table__row" v-for="cur in currencies" :key="cur">
            <td class="table__cell table__cell-currency" data-label="Валюта">{{cur}}</td>
            <td class="table__cell" data-label="Курс">{{rates[cur].toFixed(5)}}</td>
            <td class="table__cell" data-label="Дата">{{date | dateFilter('date')}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    currencies: ['RUB', 'EUR', 'USD']
  }),
  props: {
    rates: {
      type: Object,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
}
</script>