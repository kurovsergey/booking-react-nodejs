# Отчет по выполнению задачи: REST API, Авторизация и CRUD (03-create-crud-to-entity)

Мы успешно спроектировали и разработали полноценную систему REST API с JWT-авторизацией, ролевой политикой (RBAC), логикой проверки владения ресурсами (ownership), интеграцией Redis-сессий и транзакционной защитой от двойного бронирования с использованием пессимистических блокировок.

---

## 🛠 Выполненные действия и технологии

### 1. Интеграция Redis для Сессий и Инвалидации токенов
* **[RedisModule](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/redis/redis.module.ts):** Создан глобальный модуль для эффективного взаимодействия с Redis.
* **[RedisService](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/redis/redis.service.ts):** Реализует методы:
  * `setRefreshToken` и `getRefreshToken` для отслеживания активных сессий (хранение Refresh Token на 7 дней).
  * `blacklistToken` и `isTokenBlacklisted` для аннулирования Access-токенов при выходе из системы (Logout).

### 2. JWT-Авторизация и Роли (RBAC)
* Разработан **[AuthModule](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/auth/)**:
  * `POST /auth/register` — регистрация пользователей (хэширование паролей через `bcrypt`, генерация токена подтверждения аккаунта).
  * `GET /auth/verify-account` — верификация аккаунта по токену.
  * `POST /auth/login` — авторизация, выдача Access (15 минут) и Refresh (7 дней) токенов, сохранение сессии в Redis.
  * `POST /auth/refresh` — обновление пары токенов по активной сессии в Redis.
  * `POST /auth/logout` — удаление сессии из Redis и занесение текущего Access-токена в черный список.
  * `POST /auth/forgot-password` и `POST /auth/reset-password` — сброс и восстановление паролей.
* Настроены **[JwtAuthGuard](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/auth/guards/jwt-auth.guard.ts)** и **[RolesGuard](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/auth/guards/roles.guard.ts)** с декоратором `@Roles(...)` для ограничения доступа к эндпоинтам.

### 3. CRUD Модули и Разграничение Владения (Ownership)
Для того чтобы пользователи могли изменять/удалять только свои собственные ресурсы, мы расширили схему БД:
* **[Миграция](file:///d:/Job/Resume/booking-react-nodejs/backend/src/database/migrations/1717100000000-AddCreatedByToOfficeAndSeat.ts):** Добавлена колонка `created_by_id` в таблицы `offices` и `working_seats`, а также верификационные поля в таблицу `users`.
* **[UsersModule](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/users/):** Администратор имеет полный доступ. Обычные пользователи могут получать (`GET`) и обновлять (`PATCH`) только свой профиль.
* **[OfficesModule](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/offices/):** Администратор управляет всеми офисами. Обычные пользователи могут создавать офисы, а обновлять или удалять только те, у которых `createdById` совпадает с их ID.
* **[WorkingSeatsModule](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/seats/):** Аналогичная логика владения — пользователи могут модифицировать только свои рабочие места.

### 4. Защита от Overbooking (Пессимистические Блокировки)
* **[BookingsModule](file:///d:/Job/Resume/booking-react-nodejs/backend/src/modules/bookings/):**
  * Реализован строгий контроль на уровне базы данных.
  * Метод создания бронирования (`create`) выполняется внутри транзакции TypeORM. Мы накладываем **пессимистическую блокировку на запись (`pessimistic_write`)** при поиске пересекающихся бронирований на выбранные даты для конкретного рабочего места.
  * Если найдено хотя бы одно подтвержденное пересечение, транзакция прерывается и выбрасывается `ConflictException`. Это гарантирует абсолютную защиту от конкурентных запросов двойного бронирования в пиковые часы.

---

## 📈 Результаты сборки
* **Успешная сборка бэкенда:** NestJS проект скомпилирован успешно с помощью `npm run build` без каких-либо ошибок.
* **Совместимость с TypeORM 0.3+:** Все выборки связей переписаны на современный строго типизированный формат объектов (`relations: { relationName: true }`).

---

## 🚀 Что делать дальше?
Проект REST API с авторизацией, CRUD и блокировками готов. Следующим шагом мы можем реализовать WebSocket-сервер для real-time трансляции заполняемости коворкинга администраторам при бронировании!
