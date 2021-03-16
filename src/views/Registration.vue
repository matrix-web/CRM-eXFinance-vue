<template>
  <div class="container">
    <div class="auth-content">
      <div class="auth__img">
        <img src="../assets/img/background/work.png" alt="user registration">
      </div>
      <form @submit.prevent="registerUser" class="auth__form">
        <h2 class="auth__title register--position-lines">Регистрация</h2>
        <div class="input-field">
          <label class="label">
            <span class="label__text">Имя*</span>
            <input 
              class="input" 
              type="text"
              :class="{'invalid': $v.registerForm.firstName.$dirty && !$v.registerForm.firstName.required}"
              v-model.trim="$v.registerForm.firstName.$model" placeholder="Введите имя" 
            />
          </label>
          <span 
            class="helper-text"
            v-if="$v.registerForm.firstName.$dirty && !$v.registerForm.firstName.required"
          >Это поле является обязательным</span>
        </div>
        <div class="input-field">
          <label class="label">
            <span class="label__text">Фамилия*</span>
            <input 
              class="input" 
              type="text"
              :class="{'invalid': $v.registerForm.lastName.$dirty && !$v.registerForm.lastName.required}"
              v-model.trim="$v.registerForm.lastName.$model"
              placeholder="Введите фамилию"
            />
          </label>
          <span 
            class="helper-text"
            v-if="$v.registerForm.lastName.$dirty && !$v.registerForm.lastName.required"
          >Это поле является обязательным</span>
        </div>
        <div class="input-field">
          <label class="label">
            <span class="label__text">Email address*</span>
            <input 
              class="input" 
              type="email"
              placeholder="Введите email-адрес" 
              :class="{'invalid': ($v.registerForm.email.$dirty && !$v.registerForm.email.required) || 
                                  ($v.registerForm.email.$dirty && !$v.registerForm.email.email)
                      }"
              v-model.trim="$v.registerForm.email.$model" 
            />
          </label>
          <span 
            class="helper-text"
            v-if="$v.registerForm.email.$dirty && !$v.registerForm.email.required"
          >Это поле является обязательным</span>
          <span 
            class="helper-text"
            v-else-if="$v.registerForm.email.$dirty && !$v.registerForm.email.email"
          >Введите корректный email</span>
        </div>
        <div class="input-field">
          <label class="label">
            <span class="label__text">Пароль*</span>
            <input 
              class="input" 
              type="password" 
              placeholder="Введите пароль"
              :class="{'invalid': ($v.registerForm.password.$dirty && !$v.registerForm.password.required) || 
                                  ($v.registerForm.password.$dirty && !$v.registerForm.password.minLength)
                      }"
              v-model.trim="$v.registerForm.password.$model" 
            />
          </label>
          <span 
            class="helper-text"
            v-if="$v.registerForm.password.$dirty && !$v.registerForm.password.required"
          >Это поле является обязательным</span>
          <span 
            class="helper-text"
            v-else-if="$v.registerForm.password.$dirty && !$v.registerForm.password.minLength"
          >
            Пароль должен состоять из {{$v.registerForm.password.$params.minLength.min}} символов
          </span>
        </div>
        <div class="input-field auth__input-field">
          <label class="checkbox-label">
            <input class="checkbox" type="checkbox" v-model="$v.registerForm.policy.$model" />
            <span class="fake-checkbox"></span>Политика конфиденциальности
          </label>
        </div>
        <div class="input-field">
          <input class="button button--primary auth__button" type="submit" value="Зарегистрироваться">
        </div>
        <div class="auth__message">
          <span>Уже есть аккаунт? </span>
          <router-link to="/login">Выполнить вход</router-link>
        </div>
      </form>
    </div>
  </div>
</template>


<script>
import {required, email, minLength} from 'vuelidate/lib/validators'
import firebase from 'firebase/app'
import messages from '@/utils/messages'


export default {
  name: 'Registraion',
  metaInfo() {
    return {
      title: "Регистрация"
    }
  },
  data: () => ({
    registerForm: {
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      policy: false
    }
  }),
  validations: {
    registerForm: {
      firstName: {required},
      lastName: {required},
      email: {required, email},
      password: {required, minLength: minLength(8)},
      policy: {checked: v => v}
    }
  },
  methods: {
    async registerUser() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      const formData = {
        firstName: this.registerForm.firstName,
        lastName: this.registerForm.lastName,
        email: this.registerForm.email,
        password: this.registerForm.password,
        policy: this.registerForm.policy
      }

      try {
        await this.$store.dispatch('register', formData)
        this.$router.push('/')
      } catch (err) {
        this.$message(messages[err.code])
      }
    }
  }
}
</script>