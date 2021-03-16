import firebase from 'firebase/app'

export default {
  state: {
    deleted: false
  },
  mutations: {
    setDeleted(state, value) {
      state.deleted = value
    }
  },
  actions: {
    async createRecord({commit, dispatch}, record) {
      try {
        const uid = await dispatch('getUId')
        return await firebase.database().ref(`/users/${uid}/records`).push(record)
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async fetchRecords({dispatch, commit}) {
      try {
        const uid = await dispatch('getUId')
        const records = (await firebase.database().ref(`users/${uid}/records`).once('value')).val() || {}
        return Object.keys(records).map(key => ({...records[key], id: key}))
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async deleteRecords({dispatch, commit}, ids) {
      try {
        const uid = await dispatch('getUId')
        if (Array.isArray(ids)) {
          ids.forEach(async id => {
            const record = await firebase.database().ref(`users/${uid}/records`).child(id).remove(() => {
              console.log('removed record')
              commit('setDeleted', true)
            })
          }) 
        }
      } catch(err) {
        commit('setError', err)
        throw err
      }
    }
  },
  getters: {
    deleted(state) {
      return state.deleted
    }
  }
}