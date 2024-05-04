export default {
    // Ошибки //

    // 400 - Bad Request
    INVALID_DATA: "Некорректный формат данных",
    MISSING_FIELDS: "Не указаны все необходимые поля",
    PASSWORD_TOO_SHORT: "Слишком короткий пароль",

    // 401 - Unauthorized
    INCORRECT_LOGIN_OR_PASSWORD: "Неправильный логин или пароль",
    INCORRECT_OLD_PASSWORD: "Старый пароль не соответствует действительному",
    SAME_PASSWORD: "Новый пароль не может быть таким же, как старый",
    TOKEN_NOT_PROVIDED: "Токен аутентификации не предоставлен",
    TOKEN_IS_INCORRECT: "Неправильный токен аутентификации",

    // 404 - Not Found
    NOT_FOUND: "Запрашиваемый ресурс не найден",
    THEORY_NOT_FOUND: "Теория с данным ID не найдена",
    TASK_NOT_FOUND: "Задание с данным ID не найдено",
    FLAG_NOT_FOUND: "Флаг, связанный с данным пользователем, не найден. Попробуйте запустить задание заново",

    // 409 - Conflict
    ACCOUNT_ALREADY_EXISTS: "Аккаунт уже существует",
    FLAG_IS_INCORRECT: "Неправильный флаг",

    // 500 - Internal Server Error
    INTERNAL_SERVER_ERROR: "Произошла внутренняя ошибка сервера",

    // Успешные ответы //

    // 200 - OK
    SUCCESS: "Запрос выполнен успешно",
    LOGIN_SUCCESSFUL: "Успешная аутентификация",
    LOGOUT_SUCCESSFUL: "Успешный выход из аккаунта",
    ACCOUNT_CREATED_SUCCESSFULLY: "Аккаунт успешно создан",
    PASSWORD_CHANGED_SUCCESSFULLY: "Пароль был успешно изменён",
    FLAG_IS_CORRECT: "Флаг верный, задание зачтено",

    // 202 - Accepted
    TASK_ALREADY_SOLVED_BUT_FLAG_IS_CORRECT: "Флаг верный, но данное задание уже решено"
}