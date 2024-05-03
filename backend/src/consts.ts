export default {
    // Ошибки //

    // 400
    INVALID_DATA: "Некорректный формат данных",
    MISSING_FIELDS: "Не указаны все необходимые поля",
    PASSWORD_TOO_SHORT: "Слишком короткий пароль",

    // 401
    INCORRECT_LOGIN_OR_PASSWORD: "Неправильный логин или пароль",
    INCORRECT_OLD_PASSWORD: "Старый пароль не соответствует действительному",
    SAME_PASSWORD: "Новый пароль не может быть таким же, как старый",
    TOKEN_NOT_PROVIDED: "Токен аутентификации не предоставлен",
    TOKEN_IS_INCORRECT: "Неправильный токен аутентификации",

    // 404
    NOT_FOUND: "Запрашиваемый ресурс не найден",
    THEORY_NOT_FOUND: "Теория с данным ID не найдена",
    TASK_NOT_FOUND: "Задание с данным ID не найдено",

    // 409
    ACCOUNT_ALREADY_EXISTS: "Аккаунт уже существует",

    // 500
    INTERNAL_SERVER_ERROR: "Произошла внутренняя ошибка сервера",

    // Успешные ответы
    LOGIN_SUCCESSFUL: "Успешная аутентификация",
    LOGOUT_SUCCESSFUL: "Успешный выход из аккаунта",
    PASSWORD_CHANGED_SUCCESSFULLY: "Пароль был успешно изменён"
}