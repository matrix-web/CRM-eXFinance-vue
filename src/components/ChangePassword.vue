<template>
  <div class="card card-password">
    <h3 class="card__password-title">Смена пароля</h3>
    <form class="card-password__change" @submit.prevent="changePassword">
      <div class="input-field">
        <label class="label">
          <span class="label__text">Старый пароль</span>
          <input 
            class="input" 
            type="password" 
            placeholder="Введите старый пароль"
            v-model.trim="oldPassword"
            :class="$v.oldPassword.$dirty && !$v.oldPassword.required"
          />
        </label>
        <span 
            class="helper-text"
            v-if="$v.oldPassword.$dirty && !$v.oldPassword.required"
          >Это поле является обязательным</span>
      </div>
      <div class="input-field">
        <label class="label">
          <span class="label__text">Новый пароль</span>
          <input 
            class="input" 
            type="password" 
            placeholder="Введите новый пароль" 
            v-model.trim="newPassword"
            :class="($v.newPassword.$dirty && !$v.newPassword.required) ||
                    ($v.newPassword.$dirty && !$v.newPassword.minLength)"
          />
        </label>
        <span 
          class="helper-text"
          v-if="$v.newPassword.$dirty && !$v.newPassword.required"
        >Это поле является обязательным</span>
        <span 
          class="helper-text"
          v-else-if="$v.newPassword.$dirty && !$v.newPassword.minLength"
        >Пароль должен состоять из {{ $v.newPassword.$params.minLength.min }} символов</span>
      </div>
      <div class="input-field">
        <label class="label">
          <span class="label__text">Повторите пароль</span>
          <input 
            class="input" 
            type="password" 
            placeholder="Повторите пароль" 
            v-model.trim="$v.repeatPassword.$model"
          />
        </label>
        <span 
          class="helper-text"
          v-if="!$v.repeatPassword.sameAsPassword"
        >Пароли не совпадают</span>
      </div>
      <div class="input-field">
        <input class="button button--primary" type="submit" value="Сохранить">
      </div>
    </form>
  </div>
</template>

<script>
  import { required, sameAs, minLength } from 'vuelidate/lib/validators'
  export default {
    data: () => ({
      oldPassword: null,
      newPassword: null,
      repeatPassword: null
    }),
    validations: {
      oldPassword: {
        required
      },
      newPassword: {
        required,
        minLength: minLength(8)
      },
      repeatPassword: {
        sameAsPassword: sameAs('newPassword')
      }
    },
    methods: {
      changePassword() {
        if (this.$v.$invalid) {
          this.$v.$touch()
          return
        }

        const passwords = {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword
        }

        this.$store.dispatch('changePassword', passwords)

        this.oldPassword = null
        this.newPassword = null
        this.repeatPassword = null

        this.$v.$reset()
        this.$message('Пароль успешно изменен')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>