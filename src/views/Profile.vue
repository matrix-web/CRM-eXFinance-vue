<template>
  <div class="container">
    <div class="app-page">
      <div class="app-page__top">
        <h3 class="app-page__title">Профиль</h3>
      </div>
    </div>
    <Loader v-if="loading"/>
    <div class="row" v-else>
      <div class="col-12 col-sm-12 col-xl-6">
        <div class="card-wrapper">
          <div class="card card-profile">
            <div class="card__content card__user-content">
              <div class="card-img-wrapper">
                <div class="card__user-img">
                  <img :src="info.avatar && info.avatar.url" :alt="`${info.firstName} ${info.lastName}`">
                  <div class="card-profile__img-overlay" v-show="editingAvatar">
                    <form class="card__profile-form">
                      <input class="card-profile__file" type="file" id="file">
                      <label class="card-profile__file-label" for="file">
                        <svg class="card-profile__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                          <use xlink:href="../assets/img/svg/sprite/sprite.svg#image"></use>
                        </svg>
                      </label>
                    </form>
                  </div>
                </div>
                <button class="card__user-img-edit" @click="editingAvatar = !editingAvatar">
                  <svg class="card__user-img-edit-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                    <use xlink:href="../assets/img/svg/sprite/sprite.svg#edit-data"></use>
                  </svg>
                </button>
              </div>
              <div class="card__user-info">
                <h4 class="card__user-title">{{ info.firstName }} {{ info.lastName }}</h4>
                <form class="profile-edit" @submit.prevent="updateUserInfo" v-if="editingName">
                  <div class="input-field">
                    <input 
                      class="card__user-title-input profile-edit__input" 
                      type="text" 
                      v-model.trim="firstName"
                      :class="{invalid: $v.firstName.$dirty && !$v.firstName.required}"
                    >
                    <span 
                      class="helper-text"
                      v-if="$v.firstName.$dirty && !$v.firstName.required"
                    >Введите имя</span>
                  </div>
                  <div class="input-field">
                    <input 
                      class="card__user-title-input profile-edit__input" 
                      type="text" 
                      v-model.trim="lastName"
                      :class="{invalid: $v.lastName.$dirty && !$v.lastName.required}"
                    >
                    <span 
                      class="helper-text"
                      v-if="$v.lastName.$dirty && !$v.lastName.required"
                    >Введите фамилию</span>
                  </div>
                  <div class="input-field profile-edit__input-field">
                    <input class="button button--primary profile-edit__button" type="submit" value="Сохранить">
                  </div>
                </form>
                <p class="card__user-email">{{ info.email }}</p>
                <p class="card__user-balance">Баланс {{ info.bill | currency }}</p>
              </div>
            </div>
            <button class="card-profile__button-edit" @click="editingName = !editingName">
              <svg class="card-profile__button-edit__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <use xlink:href="../assets/img/svg/sprite/sprite.svg#edit-data"></use>
              </svg>
            </button>
          </div>
          <ChangePasswordForm />
        </div>
      </div>
      <div class="col-12 col-xl-6">
        <Clock/>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
import Upload from '@/assets/js/modules/uploadImg'
import Clock from '@/components/Clock'
import ChangePasswordForm from '@/components/ChangePassword'
import Loader from '@/components/app/Loader'
import firebase from 'firebase/app'

export default {
  name: 'profile',
  metaInfo() {
    return {
      title: "Профиль"
    }
  },
  data: () => ({
    avatar: null,
    inputFile: null,
    editingAvatar: false,
    editingName: false,
    loading: false,
    firstName: null,
    lastName: null
  }),
  validations: {
    firstName: {required},
    lastName: {required}
  },
  components: {
    Clock,
    Loader,
    ChangePasswordForm
  },
  methods: {
    async updateUserInfo() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      
      try {
        await this.$store.dispatch('updateInfo', {
          firstName: this.firstName,
          lastName: this.lastName
        })

        this.editingName = false
        this.$message('Профиль успешно обновлен')
      } catch (err) {
        this.$message(err.message)
        throw err
      }
    }
  },
  mounted() {
    this.firstName = this.info.firstName
    this.lastName = this.info.lastName

    const that = this
    new Upload('#file', {
      modeView: 'custom',
      buttonDownLoad: {
        selectorPos: '.card-profile',
        pos: 'beforeend'
      },
      previewPos: {
        selectorPos: '.card-profile',
        pos: 'beforeend'
      },
      accept: ['.png', '.jpg', '.jpeg', '.gif'],
      async onUpload(files) {
        const uid = await that.$store.dispatch('getUId')
        if ('avatar' in that.info && !that.info.avatar.name.includes('user')) {
          const avatarRef = firebase.storage().ref(`images/${uid}/${that.info.avatar.name}`)
          await avatarRef.delete().then(() => {
            console.log('File deleted successfully')
          }).catch(error => {
            console.error(error)
          })
        }
        files.forEach((file, index) => {
          const ref = firebase.storage().ref(`images/${uid}/${file.name}`)
          const task = ref.put(file)

          task.on('state_changed', snapshot => {
            this.progressLoadToServer({
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              index
            })
          }, error => {
            console.log(error)
          }, () => {
            task.snapshot.ref.getDownloadURL().then(url => {
              that.$store.dispatch('updateInfo', {avatar: {
                url,
                name: file.name
              }})

              that.editingAvatar = false

              that.$message('Изображение успешно изменено')
            })
          })
        })
      }
    })

    this.loading = false
  },
  computed: mapGetters(['info'])
}
</script>

<style lang="scss" scoped>
  .profile-edit {
    max-width: 300px;
    width: 100%;
    margin: 5px 0 10px;

    &__input {
      width: 100%;
      border: 1px solid #c3cad9;
      border-radius: 10px;
      padding: 8px 15px;
      font-size: .875rem;
      outline: none;

      &:focus {
        border: 1px solid #1565d8;
      }
    }

    &__button {
      font-size: .875rem;
      padding: 8px 15px;
    }
  }
</style>