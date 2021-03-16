import firebase from 'firebase/app'

export default {
  actions: {
    async fetchCategories({commit, dispatch}) {
      try {
        const uId = await dispatch('getUId')
        const categories = (await firebase.database().ref(`users/${uId}/categories`).once('value')).val() || {}

        return Object.keys(categories).map(key => ({...categories[key], id: key}))
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async fetchCategoryById({commit, dispatch}, id) {
      try {
        const uId = await dispatch('getUId')
        const category = (await firebase.database().ref(`users/${uid}/categories`).child(id).once('value')).val() || {}

        return { ...category, id }
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async createCategory({dispatch, commit}, {title, limit}) {
      try {
        const uId = await dispatch('getUId')
        const category = await firebase.database().ref(`/users/${uId}/categories`).push({title, limit})
        return {title, limit, id: category.key}
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async updateCategory({dispatch, commit}, {id, title, limit}) {
      try {
        const uId = await dispatch('getUId')
        await firebase.database().ref(`users/${uId}/categories`).child(id).update({title, limit})
      } catch(err) {
        commit('setError', err)
        throw err
      }
    }
  }
}