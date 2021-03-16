<template>
  <div class="container">
    <div class="app-page">
      <div class="app-page__top">
        <h3 class="app-page__title">История записей</h3>
      </div>
      <Loader v-if="loading"/>
      <div class="row">
        <div class="col-12">
          <section class="history">
            <div v-if="records.length">
              <div class="history__chart">
                <canvas ref="canvas"></canvas>
              </div>
              <HistoryTable 
                :records="items"
                :deleted="deleted"
                :reset="reset"
                @select-all="selectCheckboxes"
                @select-checkbox="selectCheckbox"
                @action="openModal"
                @reseted="reset = resetRequired = false"
              />
              <Paginate
                v-if="pageCount > 1"
                v-model="page"
                :page-count="pageCount"
                :click-handler="pageChangeHandler"
                :prev-text="'Назад'"
                :next-text="'Вперед'"
                :container-class="'pagination'"
                :page-link-class="'pagination__link'"
                :prev-link-class="'pagination__link'"
                :next-link-class="'pagination__link'"
                :prev-class="'pagination__item'"
                :next-class="'pagination__item'"
                :page-class="'pagination__item'"
                :active-class="'pagination__item--active'"
              />
            </div>
            <p v-else-if="!loading && !records.length">Записей пока нет. <router-link to="/record">Создать новую запись</router-link></p>
          </section>
        </div>
      </div>
      <Modal
        :isOpen="modalIsOpen"
        :title="'Вы уверены?'"
        :message="'Хотите удалить?'"
        @closed="modalIsOpen = false"
        @modal-action="removeRecords"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import Loader from '@/components/app/Loader'
import HistoryTable from '@/components/HistoryTable'
import { Pie } from 'vue-chartjs'

import Modal from '@/components/Modal'

export default {
  name: 'History',
  metaInfo() {
    return {
      title: "История"
    }
  },
  data: () => ({
    loading: true,
    records: [],
    deletedRecordsIds: [],
    page: 1,
    pageSize: 5,
    pageCount: 0,
    allItems: [],
    items: [],
    hidden: false,
    modalIsOpen: false,
    pagesState: [],
    reset: false,
    resetRequired: false
  }),
  extends: Pie,
  watch: {
    page(value) {
      this.pagesState.forEach(state => {
        if (state.pageNumber === +this.$route.query.page && !state.current) {
          state.current = true
          this.reset = this.resetRequired
        } else {
          state.current = false
        }
      })
    }
  },
  components: {
    Loader,
    HistoryTable,
    Modal
  },
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords')
    const categories = await this.$store.dispatch('fetchCategories')
    this.setup(categories)

    this.pagesState = this.allItems.map((item, index) => ({
      pageNumber: index + 1,
      current: index === 0
    }))

    this.loading = false
  },
  computed: mapGetters(['deleted']),
  methods: {
    setup(categories) {
      if (this.records.length) {
        this.setupPagination(this.records.map(record => {
          return {
            ...record,
            categoryName: categories.find(category => category.id === record.categoryId).title,
            isType: record.type === 'income'
          }
        }))

        this.renderChart({
          labels: categories.map(c => c.title),
          datasets: [{
              label: 'Расходы по категориям',
              data: categories.map(c => {
                return this.records.reduce((total, r) => {
                  if (r.categoryId === c.id && r.type === 'outcome') {
                    total += +r.sum
                  }

                  return total
                }, 0)
              }),
              backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
          }]
        })
      }
    },
    selectCheckboxes(recordsIds) {
      this.deletedRecordsIds = recordsIds
      recordsIds.length ? this.resetRequired = true : this.resetRequired = false
    },
    selectCheckbox(recordsIds) {
      this.deletedRecordsIds = recordsIds
      recordsIds.length ? this.resetRequired = true : this.resetRequired = false
    },
    setupPagination(allItems) {
      this.allItems = _.chunk(allItems, this.pageSize)
      this.pageCount = _.size(this.allItems)
      this.items = this.allItems[this.page - 1] || this.allItems[0]
    },
    pageChangeHandler(page) {
      this.$router.push(`${this.$route.path}?page=${page}`)
        .catch(err => {
          if (err.name !== 'NavigationDuplicated' && 
          !err.message.includes('Avoided redundant navigation to current location')) {
            console.error(err)
          }
        })
      this.items = this.allItems[page - 1] || this.allItems[0]
    },
    openModal() {
      this.modalIsOpen = true
    },
    async removeRecords() {
      const deletedIds = this.deletedRecordsIds.map(id => this.items[id].id)
      await this.$store.dispatch('deleteRecords', deletedIds)
      const categories = await this.$store.dispatch('fetchCategories')
      this.records = await this.$store.dispatch('fetchRecords')
      this.setup(categories)
      this.$store.commit('setDeleted', false)
      this.modalIsOpen = false

      let message = deletedIds.length == 1 
        ? 'Запись успешно удалена' 
        : 'Записи успешно удалены'
      this.$message(message)
    }
  }
}
</script>

<style lang="scss" scoped>
  .history__chart {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  canvas {
    max-width: 100%;
    @media (min-width: 768px) {
      max-width: 700px;
    }
  }
</style>