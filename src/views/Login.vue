<template>
  <div class="container">
    <div class="auth-content">
      <div class="auth__img">
        <img src="../assets/img/background/work.png" alt="user-login">
      </div>
      <form @submit.prevent="signIn" class="auth__form login__form">
        <h2 class="auth__title login--position-lines">Вход</h2>
        <div class="input-field">
          <label class="label">
            <span class="label__text">Email address</span>
            <input 
              class="input" 
              type="email" 
              placeholder="Введите email" 
              :class="{'invalid': ($v.inputForm.email.$dirty && !$v.inputForm.email.required) || 
                                  ($v.inputForm.email.$dirty && !$v.inputForm.email.email)}"
              v-model.trim="$v.inputForm.email.$model" 
            />
          </label>
          <span 
            class="helper-text"
            v-if="$v.inputForm.email.$dirty && !$v.inputForm.email.required"
          >Это поле является обязательным</span>
          <span 
            class="helper-text"
            v-else-if="$v.inputForm.email.$dirty && !$v.inputForm.email.email"
          >
            Введите корректный email
          </span>
        </div>
        <div class="input-field">
          <label class="label">
            <span class="label__text">Пароль</span>
            <input 
              class="input" 
              type="password"
              :class="{'invalid': $v.inputForm.password.$dirty && !$v.inputForm.password.required}"
              v-model.trim="$v.inputForm.password.$model" placeholder="Введите пароль" 
            />
          </label>
          <span 
            class="helper-text"
            v-if="$v.inputForm.password.$dirty && !$v.inputForm.password.required"
          >
            Введите пароль
          </span>
        </div>
        <div class="input-field auth__input-field">
          <label class="checkbox-label">
            <input class="checkbox" type="checkbox" />
            <span class="fake-checkbox"></span>Запомнить меня
          </label>
          <router-link to="/reset">Забыли пароль?</router-link>
        </div>
        <div class="input-field">
          <input class="button button--primary auth__button" type="submit" value="Войти">
        </div>
        <div class="auth__message">
          <span>У вас нет аккаунта? </span>
          <router-link to="/registration">Зарегистрироваться сейчас</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import {required, email} from 'vuelidate/lib/validators'
import messages from '@/utils/messages'

export default {
  name: 'Login',
  metaInfo() {
    return {
      title: "Вход"
    }
  },
  data: () => ({
    inputForm: {
      email: null,
      password: null
    }
  }),
  validations: {
    inputForm: {
      email: {required, email},
      password: {required}
    }
  },
  methods: {
    async signIn() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      const formData = {
        email: this.inputForm.email,
        password: this.inputForm.password
      }

      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/')
      } catch (err) {
        this.$message(messages[err.code])
      }
    }
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
  }
}
</script>