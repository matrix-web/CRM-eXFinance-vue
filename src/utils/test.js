// TODO: Реализовать динамическую генерацию контента для модального окна

const modalContent = {
  form: {
    input: {
      attributes: [['type', 'text'], ['placeholder', 'Введите логин'], ['class', ['one', 'two', 'three']]]
    },
    input: {
      attributes: {
        type: 'password',
        placeholder: 'Введите пароль',
        minLength: 6,
      }
    },
    button: {
      text: 'Войти',
      attributes: {
        class: ['one', 'two', 'three'],
        'aria-label': 'button-enter'
      }
    }
  }
}