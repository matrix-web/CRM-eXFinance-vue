import firebase from 'firebase/app'

export default {
  actions: {
    async login ({ commit }, { email, password }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password)
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async register ({ dispatch, commit }, { email, password, firstName, lastName }) {
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password)
        const uid = await dispatch('getUId')
        const storageRef = firebase.storage().ref()
        const child = storageRef.child('images/user.jpg')
        let imgUserDefault = child.name
        let imgUrl = null
        console.log(imgUserDefault)
        await child.getDownloadURL().then(url => {
          imgUrl = url
          console.log(url)
        })
        await firebase.database().ref(`/users/${uid}/info`).set({
          firstName,
          lastName,
          email,
          bill: 10000,
          avatar: {
            url: imgUrl,
            name: imgUserDefault
          }
        })
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async changePassword({ commit }, { oldPassword, newPassword }) {
      try {
        const credentialUser = firebase.auth().currentUser
        const credentials = firebase.auth.EmailAuthProvider.credential(credentialUser.email, oldPassword)
        await credentialUser.reauthenticateWithCredential(credentials)
        await credentialUser.updatePassword(newPassword).then(() => {
          console.log('Пароль успешно изменен!')
        })
      } catch (err) {
        commit('setError', err)
        throw err
      }
    },
    async logout ({ commit }) {
      await firebase.auth().signOut()
      await commit('clearInfo')
    },
    getUId() {
      const user = firebase.auth().currentUser

      return user ? user.uid : null
    }
  }
}