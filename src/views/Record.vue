<template>
  <div class="container">
    <div class="app-page">
      <div class="app-page__top">
        <h3 class="app-page__title">Новая запись</h3>
      </div>
      <div class="row">
        <div class="col-12 col-md-6">
          <Loader v-if="loading"/>
          <form class="record-form" @submit.prevent="addRecord" v-else-if="categories.length">
            <div class="input-field">
              <Select 
                :items="categoriesList"
                :placeholder="'Выберите категорию'"
                @selected="selectedCategory"
              />
            </div>
            <div class="input-field">
              <div class="radio">
                <label class="radio__label">
                  <input 
                    class="radio__button" 
                    type="radio" 
                    name="type" 
                    value="income"
                    v-model="recordForm.type"
                  />
                  <span class="radio__custom"></span>
                  <span>Доход</span>
                </label>
              </div>
              <div class="radio">
                <label class="radio__label">
                  <input class="radio__button" type="radio" name="type" value="outcome" />
                  <span class="radio__custom"></span>
                  <span>Расход</span>
                </label>
              </div>
            </div>
            <div class="input-field">
              <label class="label">
                <span class="label__text">Сумма</span>
                <input 
                  class="input" 
                  type="number" 
                  placeholder="Введите сумму" 
                  min="100"
                  v-model.number="recordForm.sum"
                  :class="{invalid: ($v.recordForm.sum.$dirty && !$v.recordForm.sum.required) || 
                                    ($v.recordForm.sum.$dirty && !$v.recordForm.sum.minValue)}"
                />
              </label>
              <span 
                class="helper-text"
                v-if="$v.recordForm.sum.$dirty && !$v.recordForm.sum.required"
              >Это поле является обязательным</span>
              <span 
                class="helper-text"
                v-else-if="$v.recordForm.sum.$dirty && !$v.recordForm.sum.minValue"
              >Минимальное значение {{$v.recordForm.sum.$params.minValue.min}}</span>
            </div>
            <div class="input-field">
              <label class="label">
                <span class="label__text">Описание</span>
                <input 
                  class="input" 
                  type="text" 
                  placeholder="Введите описание"
                  v-model.trim="recordForm.description"
                  :class="{invalid: $v.recordForm.description.$dirty && !$v.recordForm.description.required}"
                />
              </label>
              <span 
                class="helper-text"
                v-if="$v.recordForm.description.$dirty && !$v.recordForm.description.required"
              >Это поле является обязательным</span>
            </div>
            <div class="input-field">
              <input class="button button--primary record-form__button" type="submit" value="Создать">
            </div>
          </form>
          <p v-else>Категорий пока нет <router-link to="/categories">Создать новую категорию</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Select from '@/components/app/Select'

import { mapGetters } from 'vuex'
import { required, minValue } from 'vuelidate/lib/validators'
import Loader from '@/components/app/Loader'

export default {
  name: 'Record',
  metaInfo() {
    return {
      title: "Запись"
    }
  },
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    recordForm: {
      sum: 100,
      type: 'outcome',
      description: ''
    },
    category: null,
    categoriesList: []
  }),
  validations: {
    recordForm: {
      sum: {required, minValue: minValue(100)},
      description: {required}
    }
  },
  components: {
    Loader,
    Select
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.recordForm.type === 'income') {
        return true
      }
      
      return this.info.bill >= this.recordForm.sum
    }
  },
  methods: {
    async addRecord() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            ...this.recordForm,
            date: new Date().toJSON()
          })

          const bill = this.recordForm.type === 'income'
                ? this.info.bill + this.recordForm.sum
                : this.info.bill - this.recordForm.sum

          await this.$store.dispatch('updateInfo', { bill })
          this.$message('Запись успешно создана')
          this.$v.$reset()
          this.recordForm.sum = 100
          this.recordForm.description = ''
        } catch(e) {}
      } else {
        this.$message(`Недостаточно средств на счете (${this.recordForm.sum - this.info.bill})`)
      }
    },
    selectedCategory(category) {
      this.category = category.id
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')

    this.categoriesList = this.categories.map(category => ({id: category.id, value: category.title}))

    if (this.categories.length) {
      this.category = this.categories[0].id
    }

    this.loading = false
  }
}
</script>