# CRM - eXFinance

## :hammer_and_wrench: Установка
* Скачайте проект себе на локальный компьютер командой ```git clone https://github.com/matrix-web/CRM-eXFinance.git```
* После скачивания перейдите в папку с проектом и в консоли выполните установку зависимостей командой ```npm i```
* После установки зависимостей запустите сборку одной из команд:
    *  ```npm run start``` (режим разработки)
    *  ```npm run build``` (режим сборки)

Если вы всё сделали правильно, у вас должен открыться браузер с локальным сервером. Режим сборки предполагает оптимизацию проекта: сжатие изображений, минифицирование CSS и JS-файлов для загрузки на сервер.

Для просмотра Demo перейдите: [Демо](https://vue-crm-exfinance-2bd89.web.app/).

### Учебный проект CRM-system на Vue.js

## :open_file_folder: Файловая структура

```
gulp-html
├── dist
├── tasks
├── src
│   ├── assets
│   ├── components
│   ├── directives
│   ├── filters
│   ├── layouts
│   ├── mixins
│   ├── router
│   ├── store
│   ├── utils
│   └── views
├── App.vue
├── main.js
├── package.json
├── .browserlistrc
├── babel.config.js
└── .gitignore
```

* Папка ```src``` - используется во время разработки:
    * Внешние ресурсы скрипты, шрифты, стили, изображения: ```src/assets```
    * JS-файлы: ```src/js```
    * страницы сайта: ```src/views/```
    * Vuex: ```src/store```
    * Router: ```src/router```
    * Компоненты: ```src/components```
* Папка ```dist``` - папка, из которой запускается локальный сервер для разработки (при запуске ```npm run serve```)
