<template>
  <div class="container">
    <div class="app-page">
      <div class="app-page__top">
        <h3 class="app-page__title">Категории</h3>
      </div>
      <Loader v-if="loading"/>
      <div class="row" v-else>
        <CategoryCreate @created="addNewCategory" />
        <div class="col-12 col-md-6">
          <CategoryEdit
            v-if="categories.length"
            :categories="categories"
            @updated="updateCategories"
            :key="categories.lenght + updateCount"
          />
          <p v-else>Категорий пока нет</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate'
import CategoryEdit from '@/components/CategoryEdit'
import Loader from '@/components/app/Loader'

export default {
  name: 'categories',
  metaInfo() {
    return {
      title: "Категории"
    }
  },
  data: () => ({
    categories: [],
    loading: true,
    updateCount: 0
  }),
  components: {
    CategoryCreate,
    CategoryEdit,
    Loader
  },
  methods: {
    addNewCategory(category) {
      this.categories.push(category)
    },
    updateCategories(category) {
      const idx = this.categories.findIndex(c => c.id === category.id)
      this.categories[idx].title = category.title
      this.categories[idx].limit = category.limit
      this.updateCount++
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false
  }
}
</script>