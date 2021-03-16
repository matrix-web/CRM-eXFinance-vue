<template>
  <div class="col-12 col-md-6 app-page__col-content">
    <h4 class="categories-subtitle">Создать</h4>
    <form @submit.prevent="submitHandler" class="create-category-form">
      <div class="input-field">
        <label class="label">
          <span class="label__text">Название категории</span>
          <input 
            class="input" 
            type="text" 
            placeholder="Название"
            v-model.trim="$v.categoryCreateForm.title.$model"
          />
        </label>
        <span 
          class="helper-text"
          v-if="$v.categoryCreateForm.title.$dirty && !$v.categoryCreateForm.title.required"
        >Это поле является обязательным</span>
      </div>
      <div class="input-field">
        <label class="label">
          <span class="label__text">Лимит</span>
          <input 
            class="input" 
            type="number" 
            placeholder="Введите сумму" 
            :min="$v.categoryCreateForm.limit.$params.minValue.min"
            v-model.trim="$v.categoryCreateForm.limit.$model"
          />
        </label>
        <span 
          class="helper-text"
          v-if="$v.categoryCreateForm.limit.$dirty && !$v.categoryCreateForm.limit.required"
        >Это поле является обязательным</span>
        <span 
          class="helper-text"
          v-else-if="$v.categoryCreateForm.limit.$dirty && !$v.categoryCreateForm.limit.minValue"
        >Минимальное значение {{$v.categoryCreateForm.limit.$params.minValue.min}}</span>
      </div>
      <div class="input-field">
        <input class="button button--primary" type="submit" value="Создать">
      </div>
    </form>
  </div>
</template>

<script>
import {required, minValue} from 'vuelidate/lib/validators'
export default {
  data: () => ({
    categoryCreateForm: {
      title: null,
      limit: null
    }
  }),
  validations: {
    categoryCreateForm: {
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
        const category = await this.$store.dispatch('createCategory', {
          title: this.categoryCreateForm.title,
          limit: this.categoryCreateForm.limit
        })

        this.$emit('created', category)
        this.$message('Категория успешно создана!')
        this.categoryCreateForm.title = ''
        this.categoryCreateForm.limit = 100
        this.$v.$reset()
      } catch (err) {

      }
    }
  }
}
</script>