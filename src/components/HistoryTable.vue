<template>
  <div>
    <table class="history-table">
      <thead class="history-table__head">
        <tr class="history-table__row" v-if="selectedCheckboxesId.length">
          <td class="history-table__cell history-table__cell--info" colspan="7">
            <span>{{ selectedCheckboxesId.length }} Выбрано</span>
            <button class="history-table__button-delete" @click="$emit('action')">
              <svg class="history-table__button-delete-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <use xlink:href="../assets/img/svg/sprite/sprite.svg#trash"></use>
              </svg>
            </button>
          </td>
        </tr>
        <tr class="history-table__row-head">
          <th class="history-table__cell-title">
            <label class="checkbox-label">
              <input class="checkbox" type="checkbox" @click="selectAll"/>
              <span class="fake-checkbox"></span>
            </label>
          </th>
          <th class="history-table__cell-title history-table__cell--hide">#</th>
          <th class="history-table__cell-title history-table__cell--hide">Сумма</th>
          <th class="history-table__cell-title history-table__cell--hide">Дата</th>
          <th class="history-table__cell-title history-table__cell--hide">Категория</th>
          <th class="history-table__cell-title history-table__cell--hide">Описание</th>
          <th class="history-table__cell-title history-table__cell--hide">Тип</th>
        </tr>
      </thead>
      <tbody>
        <tr class="history-table__row" v-for="(record, index) in records" :key="record.id">
          <td class="history-table__cell">
            <label class="checkbox-label">
              <input class="checkbox" ref="checkbox" :data-id="index" type="checkbox" @click="selectCheckbox" />
              <span class="fake-checkbox"></span>
            </label>
          </td>
          <td class="history-table__cell" data-label="#">{{ index + 1 }}</td>
          <td class="history-table__cell" data-label="Сумма">{{ record.sum | currency }}</td>
          <td class="history-table__cell" data-label="Дата">{{ record.date | dateFilter }}</td>
          <td class="history-table__cell" data-label="Категория">{{ record.categoryName }}</td>
          <td class="history-table__cell" data-label="Описание">{{ record.description }}</td>
          <td class="history-table__cell" data-label="Тип">
            <svg class="history-table__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <use :xlink:href="require('../assets/img/svg/sprite/sprite.svg') + `${record.isType ? '#income' : '#outcome'}`"></use>
            </svg>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    data: () => ({
      checkboxIdx: [],
      selectedCheckboxesId: [],
      checkboxes: [],
      checkboxAll: null,
    }),
    props: {
      records: {
        required: true,
        type: Array
      },
      deleted: {
        type: Boolean,
        required: true
      },
      reset: {
        type: Boolean,
        required: true
      }
    },
    watch: {
      deleted(value) {
        value && this.resetTable()
      },
      reset(value) {
        if (value) {
          this.resetTable()
          this.$emit('reseted')
        }
      }
    },
    methods: {
      selectAll(event) {
        this.checkboxAll = event.target
        this.checkboxes = this.$refs.checkbox.map(checkbox => {
          checkbox.checked = this.checkboxAll.checked
          return checkbox
        })

        if (this.checkboxAll.checked) {
          this.selectedCheckboxesId = this.checkboxes.map(checkbox => +checkbox.dataset.id)
        } else {
          this.selectedCheckboxesId.splice(0)
        }

        this.$emit('select-all', this.selectedCheckboxesId)
      },
      resetTable() {
        if (this.checkboxes.length && (this.checkboxAll && this.checkboxAll.checked)) {
          this.checkboxes.forEach(checkbox => checkbox.checked = false)
          this.checkboxAll.checked = false
          this.checkboxes.splice(0)
        }
        this.selectedCheckboxesId.length && this.selectedCheckboxesId.splice(0)
        this.checkboxes.splice(0)
      },
      selectCheckbox(event) {
        const target = event.target
        if (target.checked) {
          this.checkboxes.push(target)
          this.selectedCheckboxesId.push(+target.dataset.id)
        } else {
          const checkboxIdx = this.checkboxes.findIndex(checkbox => +checkbox.dataset.id === +target.dataset.id)
          const index = this.selectedCheckboxesId.findIndex(num => num === +target.dataset.id)
          this.selectedCheckboxesId.splice(index, 1)
          this.checkboxes.splice(checkboxIdx, 1)

          if (!this.selectedCheckboxesId.length && (this.checkboxAll && this.checkboxAll.checked)) {
            this.checkboxAll.checked = false
          }
        }

        this.$emit('select-checkbox', this.selectedCheckboxesId)
      }
    }
  }
</script>