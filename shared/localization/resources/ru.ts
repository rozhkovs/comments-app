import { AppLocale } from './types';

export const ruLocale: AppLocale = {
  translation: {},
  signup: {
    title: 'Регистрация пользователя',
    input: {
      email: {
        label: 'Email',
        placeholder: 'Введите email...',
        required: 'Не заполнен email',
        invalidFormat: 'Неверный формат электронной почты',
      },
      name: {
        label: 'Имя',
        placeholder: 'Введите имя...',
        required: 'Не заполнено имя',
        invalidFormat:
          'Неверный формат. Укажите только цифры или буквы латинского алфавита',
      },
    },
    button: {
      signup: 'Зарегистрироваться',
    },
    alert: {
      notValid: 'Пожалуйста, проверьте правильность заполненных полей',
    },
  },
};
