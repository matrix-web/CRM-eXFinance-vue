<template>
  <div class="container">
    <div class="auth-content">
      <form class="reset__form">
        <h2 class="reset__title reset--position-lines">Сброс пароля</h2>
        <p class="reset__message">Введите ваш email-адрес для сброса пароля</p>
        <div class="input-field">
          <label class="label">
            <span class="label__text">Email address</span>
            <input class="input" type="email" placeholder="Введите email" />
          </label>
          <span class="helper-text">Это поле является обязательным</span>
        </div>
        <div class="input-field">
          <input class="button button--primary auth__button" type="submit" value="Сбросить пароль">
        </div>
      </form>
      <div class="reset__img">
        <img src="../assets/img/background/reset.jpg" alt="user reset">
      </div>
    </div>
  </div>
</template>