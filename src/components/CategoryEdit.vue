<template>
  <div>
    <h4 class="categories-subtitle">Редактировать</h4>
    <form @submit.prevent="submitHandler" class="create-category-form">
      <div class="input-field">
        <Select 
          :items="categoriesList"
          :placeholder="'Выберите категорию'"
          :defaultSelectedId="selectedId"
          @selected="selectedCategory"
        />
      </div>
      <div class="input-field">
        <label class="label">
          <span class="label__text">Название категории</span>
          <input 
            class="input" 
            type="text" 
            placeholder="Название"
            :class="{'invalid': $v.categoryEditForm.title.$dirty && !$v.categoryEditForm.title.required}"
            v-model.trim="$v.categoryEditForm.title.$model"
          />
        </label>
        <span 
          class="helper-text"
          v-if="$v.categoryEditForm.title.$dirty && !$v.categoryEditForm.title.required"
        >Это поле является обязательным</span>
      </div>
      <div class="input-field">
        <label class="label">
          <span class="label__text">Лимит</span>
          <input class="input" 
            type="number" 
            placeholder="Введите сумму" 
            :min="$v.categoryEditForm.limit.$params.minValue.min"
            :class="{'invalid': ($v.categoryEditForm.limit.$dirty && !$v.categoryEditForm.limit.required) || 
                                ($v.categoryEditForm.limit.$dirty && !$v.categoryEditForm.limit.minValue)
                    }"
            v-model.number="$v.categoryEditForm.limit.$model"
          />
        </label>
        <span 
          class="helper-text"
          v-if="$v.categoryEditForm.limit.$dirty && !$v.categoryEditForm.limit.required"
        >Это поле является обязательным</span>
        <span 
          class="helper-text"
          v-else-if="$v.categoryEditForm.limit.$dirty && !$v.categoryEditForm.limit.minValue"
        >
          Минимальное значение {{$v.categoryEditForm.limit.$params.minValue.min}}
        </span>
      </div>
      <div class="input-field">
        <input class="button button--primary" type="submit" value="Обновить">
      </div>
    </form>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'
import Select from '@/components/app/Select'

export default {
  data: () => ({
    categoryEditForm: {
      title: null,
      limit: 100,
      select: null,
      current: null
    },
    categoriesList: [],
    selectedId: null
  }),
  created() {
    const {id, title, limit} = this.categories[0]
    this.categoryEditForm.current = id
    this.categoryEditForm.title = title
    this.categoryEditForm.limit = limit
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  validations: {
    categoryEditForm: {
      title: {required},
      limit: {required, minValue: minValue(100)}
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const categoryData = {
          id: this.categoryEditForm.current,
          title: this.categoryEditForm.title,
          limit: this.categoryEditForm.limit
        }

        await this.$store.dispatch('updateCategory', categoryData)
        this.$emit('updated', categoryData)
        this.$message('Категория успешно обновлена!')
      } catch (err) {}
    },
    selectedCategory(item) {
      const { title, limit } = this.categories.find(category => category.id === item.id)
      this.categoryEditForm.title = title
      this.categoryEditForm.limit = limit
      this.selectedId = item.id
    }
  },
  components: {
    Select
  },
  mounted() { 
    this.selectedId = this.categoryEditForm.current
    this.categoriesList = this.categories.map(category => ({id: category.id, value: category.title}))
  }
}
</script>