export const ru = {
  logs: {
    routeChange: 'Переход: {from} -> {to}',
    login: 'Авторизация пользователя {username}',
    logout: 'Выход пользователя {username}',
    fallbackUser: 'user'
  },
  state: {
    loading: 'Загрузка данных...'
  },
  common: {
    refresh: 'Обновить',
    save: 'Сохранить',
    saveRoles: 'Сохранить роли',
    send: 'Отправить',
    create: 'Создать',
    close: 'Закрыть',
    confirm: 'Подтвердить',
    reject: 'Отклонить',
    selectUser: 'Выберите пользователя',
    selectCompany: 'Выберите компанию',
    selectPayment: 'Выберите платеж',
    unexpectedError: 'Непредвиденная ошибка'
  },
  header: {
    title: 'Clearing Portal',
    subtitle: 'Расчеты и контроль клиринговых операций'
  },
  footer: {
    contactsTitle: 'Контакты',
    contacts: ['1', '2', '3'],
    linksTitle: 'Быстрые ссылки',
    about: 'О системе',
    docs: 'Документация',
    dashboard: 'Личный кабинет',
    newsletterTitle: 'Рассылка',
    emailPlaceholder: 'Ваш email',
    subscribe: 'Подписаться',
    rights: '© 2026. Все права защищены.'
  },
  navbar: {
    home: 'Главная',
    about: 'О системе',
    api: 'API',
    dashboard: 'Личный кабинет',
    settlements: 'Расчеты',
    logout: 'Выйти',
    login: 'Войти',
    fallbackUser: 'Пользователь',
    sessionEnded: 'Сессия завершена'
  },
  sidebar: {
    navigation: 'Навигация портала',
    overview: 'Обзор',
    payments: 'Платежи и ЭДС',
    support: 'Обращения',
    settlements: 'Расчеты',
    participants: 'Участники',
    transactions: 'Транзакции',
    admin: 'Админ панель',
    adminGroup: 'Администрирование',
    adminLinks: {
      approvals: 'Подтверждения',
      config: 'Настройки',
      companies: 'Компании',
      users: 'Пользователи',
      security: 'Роли и права',
      authHistory: 'История авторизации'
    },
    access: 'Доступ',
    fallbackName: 'Local OAuth',
    fallbackSubtitle: 'Bearer session for protected dashboard routes',
    kycLine: 'KYC: {kyc} / {status}'
  },
  hero: {
    eyebrow: 'infrastructure',
    openDashboard: 'Открыть кабинет',
    docs: 'Документация API',
    fallbackTitle: 'Клиринговый портал для расчетов',
    fallbackDescription: 'Единая витрина для мониторинга участников, расчетных инструкций, риска и интеграционных сценариев.'
  },
  features: {
    title: 'Наши возможности',
    items: [
      {
        symbol: 'CL',
        title: 'Клиринговый цикл',
        description: 'Операционный день, подтверждение инструкций и контроль состояния расчетов в одном интерфейсе.'
      },
      {
        symbol: 'RS',
        title: 'Риск и обеспечение',
        description: 'Единая панель для контроля маржи, гарантийного фонда и активных риск-сигналов.'
      },
      {
        symbol: 'AP',
        title: 'Публичный API',
        description: 'Guide, OpenAPI доступны из единой документационной витрины.'
      }
    ]
  },
  home: {
    activityTitle: 'Основная деятельность',
    activityLead: 'Клиринговый портал предназначен для сопровождения расчетных операций, управления компаниями, обработки заявок на ЭДС и контроля статусов исполнения в едином цифровом контуре.',
    participantCategories: 'Виды клиринга',
    participantCategoriesLead: 'Система поддерживает несколько моделей обработки расчетных операций в зависимости от типа обязательств, скорости исполнения и сценария обработки.',
    servicedMarkets: 'Преимущества системы',
    servicedMarketsLead: 'Платформа объединяет административный, расчетный и пользовательский контуры в едином web-портале.',
    clearingTypes: [
      'Брутто-клиринг в реальном времени для индивидуальных расчетов по каждой операции.',
      'Нетто-клиринг для взаимозачета обязательств и формирования итоговых позиций участников.',
      'Пакетный клиринг для обработки групп операций по установленным временным окнам.'
    ],
    advantages: [
      'Админ панель для управления пользователями, ролями, permissions и связками компаний.',
      'Личный кабинет пользователя для платежей, обращений, компаний и истории авторизации.',
      'Открытое API и расчетные модули для интеграции платежных и клиринговых операций.'
    ],
    faqTitle: 'Часто задаваемые вопросы',
    newsTitle: 'Последние новости',
    fallbackNews: [
      {
        date: '24.05.2026',
        time: '10:00',
        title: 'Обновлен модуль подтверждения межкорпоративных операций',
        summary: 'В системе расширен сценарий обработки переводов ЭДС между компаниями: добавлены резервирование суммы у отправителя, подтверждение получателем и финальное согласование администратором.'
      },
      {
        date: '22.05.2026',
        time: '14:30',
        title: 'Добавлена детализация шагов обработки платежных операций',
        summary: 'Пользователи и администраторы теперь могут просматривать полный маршрут обработки операции: от создания заявки до подтверждения, отклонения или завершения расчетного этапа.'
      },
      {
        date: '20.05.2026',
        time: '09:15',
        title: 'Расширены возможности открытого API для партнерских интеграций',
        summary: 'В документации и публичных маршрутах API актуализированы сценарии приема платежей, погашения, выпуска ЭДС и получения статусов операций для внешних систем.'
      }
    ],
    faqs: [
      {
        question: 'Как пользователь получает доступ к операциям?',
        answer: 'Доступ к операциям предоставляется после регистрации, локальной авторизации и прохождения биометрической проверки. После подтверждения личности пользователь получает доступ к компаниям, счетам, платежным операциям и взаиморасчетам в пределах назначенных ролей и разрешений.'
      },
      {
        question: 'Как создаются взаиморасчеты?',
        answer: 'Взаиморасчеты могут формироваться вручную через интерфейс портала или через загрузку реестров операций. При создании инструкции система автоматически подставляет участника, клиринговый счет, параметры обработки и сохраняет операцию в расчетном контуре для дальнейшего подтверждения и исполнения.'
      }
    ]
  },
  about: {
    title: 'О системе Clearing Portal',
    tagline: 'Компонентный фронт для клирингового сервиса с локальным OAuth, ролями доступа и PostgreSQL-инфраструктурой.',
    missionTitle: 'Наша миссия',
    missionLead: 'Платформа предназначена для цифрового сопровождения клиринговых и платежных операций, объединяя пользовательский контур, административное управление и расчетную инфраструктуру в едином web-портале.',
    missionPoints: [
      'обеспечить прозрачное управление компаниями, счетами, кошельками и заявками на выпуск ЭДС;',
      'предоставить единый интерфейс для взаиморасчетов, платежных операций, обращений и контроля статусов;',
      'создать масштабируемую архитектуру для интеграции с внешними системами через открытое API.'
    ],
    quickLinks: 'Быстрые ссылки:',
    quickLinksFallback: [
      { title: 'Правила клиринга', href: '#' },
      { title: 'Тарифы и комиссии', href: '#' },
      { title: 'Форматы отчетности', href: '#' }
    ],
    featureTitle: 'Ключевые функции',
    monitorTitle: 'Операционный мониторинг',
    monitorDesc: 'Личный кабинет разделен на специализированные экраны: обзор, взаиморасчеты, участники, транзакции, история авторизации и контроль обращений.',
    adminTitle: 'Административное управление',
    adminDesc: 'Админ-панель позволяет управлять пользователями, ролями, permissions, компаниями, конфигурацией платформы и журналом авторизации.',
    developersTitle: 'Разработчикам',
    developersDesc: 'Публичная страница документации содержит integration guide, OpenAPI-спецификацию и точки входа для интеграции внешних сервисов.'
  },
  developers: {
    kicker: 'Разработчикам',
    title: 'Документация API для внешних интеграций',
    description: 'Публичный раздел для команд разработки: auth, settlements, participants, reports и webhook callbacks.',
    formatsLabel: 'Formats',
    formatsValue: 'JSON + YAML',
    callbacksLabel: 'Callbacks',
    callbacksValue: 'Webhooks',
    authLabel: 'Auth model',
    authValue: 'Local OAuth bearer',
    guideTitle: 'Integration guide',
    openApiTitle: 'OpenAPI'
  },
  auth: {
    tabs: {
      login: 'Вход',
      register: 'Регистрация'
    },
    login: {
      heading: 'Вход',
      username: 'Имя пользователя:',
      password: 'Пароль:',
      submit: 'Войти',
      submitLoading: 'Вход...',
      error: 'Ошибка авторизации'
    },
    register: {
      heading: 'Регистрация пользователя',
      username: 'Логин:',
      email: 'Email:',
      fullName: 'ФИО:',
      phone: 'Телефон:',
      companyName: 'Компания:',
      password: 'Пароль:',
      helper: 'Компания создается сразу при регистрации и дальше не редактируется из профиля.',
      submit: 'Создать пользователя',
      submitLoading: 'Создание...',
      info: 'После регистрации сразу создаются пользователь, компания, кошелек компании, merchant и клиринговый счет со статусом pending biometric.',
      success: 'Пользователь {username} и компания {companyName} созданы. Теперь выполните вход и пройдите биометрию.',
      error: 'Ошибка регистрации'
    }
  },
  identity: {
    kicker: 'KYC / Биометрия',
    title: 'Идентификация пользователя',
    lead: 'Для перевода учетной записи в статус `identified` нужно пройти биометрическую проверку. После подтверждения кошелек и клиринговый счет активируются как полноценные.',
    currentStatus: 'Текущий статус',
    kycLevel: 'KYC уровень',
    biometric: 'Биометрия',
    cameraTitle: 'Локальная проверка через камеру',
    cameraDesc: 'Мы не показываем технические параметры проверки. Достаточно дать согласие на обработку биометрии и открыть камеру для локальной верификации.',
    cameraClosed: 'Камера еще не открыта',
    consent: 'Согласие на обработку биометрии',
    cameraOpen: 'Открыть камеру',
    cameraActive: 'Камера активна',
    verify: 'Подтвердить личность',
    verifyLoading: 'Проверка...',
    unsupported: 'Браузер не поддерживает доступ к камере',
    opened: 'Камера открыта. Можно подтвердить личность.',
    openError: 'Не удалось открыть камеру',
    success: 'Пользователь идентифицирован. Wallet tier: {walletTier}.',
    error: 'Ошибка биометрической проверки'
  },
  dashboard: {
    main: {
      title: 'Личный кабинет',
      welcome: 'Добро пожаловать, {name}',
      fallbackUser: 'Пользователь',
      unidentifiedTitle: 'Пользователь еще не идентифицирован',
      unidentifiedDesc: 'Для полного допуска к платежному и клиринговому контуру пройдите биометрическую проверку.',
      passBiometry: 'Пройти биометрию',
      operatingDay: 'Операционный день',
      processedDeals: 'Обработано сделок: {value}',
      volume: 'Объем расчетов',
      openSettlements: 'Открытые расчеты: {value}',
      approvalQueue: 'Approval queue',
      openTickets: 'Открытые обращения: {value}'
      ,
      authHistoryKicker: 'История входов',
      authHistoryTitle: 'Моя история авторизации',
      authHistoryCaption: 'Последние события входа, обновления токенов и локальной авторизации.',
      authHistoryColumns: {
        time: 'Время',
        event: 'Событие',
        status: 'Статус',
        client: 'Клиент',
        ip: 'IP адрес',
        details: 'Детали'
      },
      authHistorySuccess: 'Успешно',
      authHistoryFailed: 'Ошибка',
      authHistoryUnknown: 'не указан',
      authHistoryEmpty: 'без деталей',
      authHistoryEmptyState: 'История авторизации пока отсутствует.'
    },
    payments: {
      kicker: 'Покупка ЭДС',
      title: 'Компании пользователя, балансы и взаиморасчеты',
      lead: 'В этой системе пользователь работает только с теми компаниями, которые назначены администратором или созданы им самим. На каждую компанию открываются отдельный счет и баланс, и уже от ее имени идут взаиморасчеты и покупка ЭДС.',
      blockedKicker: 'Ограничение',
      blockedTitle: 'Сначала нужна локальная биометрия',
      blockedDesc: 'Создание компании, открытие счета и покупка ЭДС доступны только пользователям, прошедшим локальную биометрию.',
      myCompanies: 'Мои компании',
      addCompany: 'Добавить компанию',
      createCompany: 'Открыть компанию',
      createCompanyLoading: 'Создание...',
      companyCode: 'Код компании',
      companyName: 'Название компании',
      merchantCode: 'Merchant code',
      userCompanies: 'Компании пользователя',
      accountsAndBalances: 'Открытые счета и балансы',
      balance: 'Баланс: {value} KZT',
      clearing: 'Clearing: {value}',
      settlementAccount: 'Settlement account: {value}',
      companiesEmpty: 'Пока нет доступных компаний. Администратор должен назначить компанию пользователю или пользователь может создать новую после локальной биометрии.',
      newOperation: 'Новая операция',
      edsPurchase: 'Покупка ЭДС на компанию',
      submitRequest: 'Отправить заявку',
      submitRequestLoading: 'Отправка...',
      selectCompany: 'Выберите компанию',
      selectMerchant: 'Выберите merchant',
      transferLead: 'Если компания-получатель не указана, будет создана обычная заявка на покупку ЭДС. Если компания-получатель указана, система проверит остаток ЭДС у отправителя, зарезервирует сумму на его счете, покажет операцию получателю, а после подтверждения получателя и администратора переведет ЭДС второй компании.',
      amount: 'Сумма',
      currency: 'Валюта',
      description: 'Описание операции',
      sentRegistry: 'Отправитель',
      sentTitle: 'Отправленные операции',
      sentEmpty: 'Отправленных операций пока нет.',
      assignedRegistry: 'Получатель',
      assignedTitle: 'Назначенные операции',
      assignedLead: 'Операции, отправленные в вашу компанию внешним агентом или другой компанией, появляются в блоке назначенных. Получатель видит статус, может принять операцию или отклонить ее с указанием причины.',
      assignedEmpty: 'Назначенных операций пока нет.',
      registry: 'Реестр заявок',
      paymentsAndSettlements: 'Платежные операции и взаиморасчеты',
      details: 'Детализация',
      type: 'Тип:',
      status: 'Статус:',
      company: 'Компания:',
      sender: 'Отправитель:',
      recipient: 'Получатель:',
      channel: 'Канал:',
      initiator: 'Инициатор:',
      createdAt: 'Создано:',
      direction: 'Маршрут:',
      processingDescription: 'Описание:',
      steps: 'Шаги обработки',
      noRecipient: 'не назначен',
      initiatorUnknown: 'не указан',
      rejectReasonTitle: 'Причина отклонения операции',
      rejectReasonLead: 'Укажите причину отклонения для операции {paymentNumber}. Она будет сохранена в истории шагов и станет видна отправителю.',
      rejectReasonPlaceholder: 'Например: операция отклонена из-за несоответствия реквизитов или отсутствия подтверждающих данных.',
      submitRejectReason: 'Отклонить с причиной',
      rejectCommentRequired: 'Укажите причину отклонения операции',
      acceptAssignedSuccess: 'Операция {paymentNumber} подтверждена получателем.',
      rejectAssignedSuccess: 'Операция {paymentNumber} отклонена получателем.',
      resolveAssignedError: 'Не удалось обработать назначенную операцию',
      createCompanySuccess: 'Компания {companyName} добавлена. Для нее открыт отдельный счет и баланс.',
      createCompanyError: 'Не удалось добавить компанию',
      purchaseSuccess: 'Заявка на покупку ЭДС отправлена. Ожидается подтверждение администратором.',
      transferSuccess: 'Операция отправки ЭДС создана. Сумма зарезервирована у отправителя и ожидает подтверждения получателя и администратора.',
      purchaseError: 'Failed to create payment'
    },
    support: {
      kicker: 'Обращения',
      title: 'Заявки пользователей и коммуникация с поддержкой',
      lead: 'Создавайте обращения, отслеживайте статусы и ведите переписку по каждому тикету внутри портала.',
      newTicket: 'Новое обращение',
      createTicket: 'Создать заявку',
      createLead: 'Оформите тему, категорию и описание проблемы, после чего переписка будет вестись в одном потоке сообщений.',
      subject: 'Тема',
      description: 'Описание обращения',
      myTickets: 'Мои обращения',
      ticketList: 'Список тикетов',
      chat: 'Переписка',
      selectTicket: 'Выберите обращение',
      createError: 'Failed to create ticket',
      messagesError: 'Не удалось загрузить переписку',
      replyError: 'Не удалось отправить сообщение',
      sendReply: 'Отправить сообщение',
      replyPlaceholder: 'Напишите ответ или дополнительную информацию по обращению',
      emptyPreview: 'Ожидается первое сообщение',
      emptyTickets: 'Пока нет обращений. Создайте первое обращение через форму выше.',
      emptyMessages: 'По этому обращению пока нет переписки.',
      adminAuthor: 'Поддержка / администратор',
      userAuthor: 'Пользователь',
      messageCount: 'Сообщений: {value}',
      categories: {
        payments: 'Payments',
        verification: 'Verification',
        wallet: 'Wallet',
        system: 'System'
      },
      priorities: {
        low: 'Low',
        medium: 'Medium',
        high: 'High'
      }
    },
    admin: {
      kicker: 'Администрирование',
      title: 'Роли, пользователи, доступы к компаниям и подтверждение ЭДС',
      adminLinks: {
        approvals: 'Подтверждения',
        config: 'Настройки',
        companies: 'Компании',
        users: 'Пользователи',
        security: 'Роли и права',
        authHistory: 'История авторизации'
      },
      overviewTitle: 'Обзор администрирования',
      overviewDescriptions: {
        overview: 'Выберите нужный административный раздел слева для перехода к отдельной странице управления.',
        approvals: 'Подтверждение заявок и решений администратора по операциям и ЭДС.',
        config: 'Глобальные настройки платформы и конфигурационные параметры.',
        companies: 'Создание, просмотр и удаление компаний платежного контура.',
        users: 'Назначение ролей пользователям и привязка доступов к компаниям.',
        security: 'Справочник ролей и разрешений системы.',
        authHistory: 'Журнал входов, обновлений токенов и ошибок авторизации по всем пользователям.'
      },
      usersStat: 'Учетных записей в системе',
      companiesStat: 'Компаний в платежном контуре',
      approvalsStat: 'Ожидают решения администратора',
      assignmentsStat: 'Активных связок user-company',
      assignmentsKicker: 'Assignments',
      approvalsKicker: 'Approvals',
      approvalsTitle: 'Очередь подтверждений ЭДС',
      requestedRole: 'Требуемая роль: {value}',
      requester: 'Инициатор: {value}',
      approve: 'Подтвердить',
      reject: 'Отклонить',
      systemConfig: 'System config',
      configTitle: 'Глобальные настройки',
      companiesKicker: 'Companies',
      companiesTitle: 'Управление компаниями',
      companiesLead: 'Таблица компаний платежного контура со статусами, счетами и балансами.',
      companyCreateTitle: 'Создание новой компании',
      companyCreateLead: 'Создайте компанию один раз, после чего она появится в платежном контуре и станет доступна для связок и операций.',
      createCompany: 'Создать компанию',
      deleteCompany: 'Удалить компанию',
      companyCodePlaceholder: 'Код компании',
      companyNamePlaceholder: 'Название компании',
      companyMerchantPlaceholder: 'Merchant code',
      autoGenerated: 'Автоматически',
      zeroBalance: '0 KZT',
      activeStatus: 'active',
      companyCreated: 'Компания {companyName} создана',
      companyDeleted: 'Компания {companyName} удалена',
      companyCreateError: 'Не удалось создать компанию',
      companyDeleteError: 'Не удалось удалить компанию',
      createUser: 'Создать пользователя',
      deleteUser: 'Удалить пользователя',
      createRole: 'Создать роль',
      deleteRole: 'Удалить роль',
      createPermission: 'Создать permission',
      deletePermission: 'Удалить permission',
      userCreateTitle: 'Создание пользователя',
      userCreateLead: 'Новый пользователь создается отдельно от связок с компаниями и может сразу получить необходимые роли.',
      roleCreateTitle: 'Создание роли',
      roleCreateLead: 'Сформируйте роль и назначьте ей набор разрешений по секциям системы.',
      permissionCreateTitle: 'Создание permission',
      permissionCreateLead: 'Добавляйте разрешения в справочник и распределяйте их по функциональным секциям.',
      rolesSelectionTitle: 'Роли для нового пользователя',
      rolesSelectionLead: 'Выберите набор ролей, который будет назначен сразу после создания.',
      permissionsSelectionTitle: 'Набор разрешений роли',
      permissionsSelectionLead: 'Разрешения сгруппированы по секциям для удобного выбора и редактирования.',
      permissionsDefaultGroup: 'general',
      roleCodeLabel: 'Код роли',
      userCreated: 'Пользователь {username} создан',
      userUpdated: 'Пользователь {username} обновлен',
      userDeleted: 'Пользователь {username} удален',
      userCreateError: 'Не удалось создать пользователя',
      userUpdateError: 'Не удалось обновить пользователя',
      userDeleteError: 'Не удалось удалить пользователя',
      roleCreated: 'Роль {code} создана',
      roleUpdated: 'Роль {code} обновлена',
      roleDeleted: 'Роль {code} удалена',
      roleCreateError: 'Не удалось создать роль',
      roleUpdateError: 'Не удалось обновить роль',
      roleDeleteError: 'Не удалось удалить роль',
      permissionCreated: 'Permission {code} создан',
      permissionUpdated: 'Permission {code} обновлен',
      permissionDeleted: 'Permission {code} удален',
      permissionCreateError: 'Не удалось создать permission',
      permissionUpdateError: 'Не удалось обновить permission',
      permissionDeleteError: 'Не удалось удалить permission',
      newUserCompaniesHint: 'Компании назначаются отдельно через связку доступа',
      userCreatePlaceholders: {
        username: 'Логин',
        email: 'Email',
        fullName: 'ФИО',
        phone: 'Телефон',
        password: 'Пароль',
        passwordOptional: 'Новый пароль'
      },
      rolePlaceholders: {
        code: 'Код роли',
        name: 'Название роли'
      },
      permissionPlaceholders: {
        code: 'Код permission',
        name: 'Название permission',
        section: 'Секция'
      },
      companyColumns: {
        code: 'Код',
        name: 'Название',
        merchant: 'Merchant',
        account: 'Расчетный счет',
        balance: 'Баланс',
        status: 'Статус',
        actions: 'Действия'
      },
      approvalColumns: {
        payment: 'Платеж',
        type: 'Тип',
        status: 'Статус',
        role: 'Роль',
        requester: 'Инициатор',
        actions: 'Действия'
      },
      configColumns: {
        key: 'Ключ',
        description: 'Описание',
        value: 'Значение',
        actions: 'Действия'
      },
      userColumns: {
        user: 'Пользователь',
        email: 'Email',
        profile: 'Профиль',
        kyc: 'Статус KYC',
        companies: 'Компании',
        roles: 'Роли',
        actions: 'Действия'
      },
      accessColumns: {
        user: 'Пользователь',
        company: 'Компания',
        role: 'Роль доступа',
        status: 'Статус'
      },
      securityColumns: {
        code: 'Код',
        name: 'Наименование',
        section: 'Секция',
        permissions: 'Permissions',
        actions: 'Действия'
      },
      usersKicker: 'Users',
      rolesTitle: 'Назначение ролей пользователям',
      kyc: 'KYC: {kyc} / {status}',
      companies: 'Компании: {value}',
      noCompanies: 'не назначены',
      companyAccessKicker: 'Company access',
      companyAccessTitle: 'Связка компании и пользователя',
      companyAccessLead: 'Назначьте пользователю нужную компанию и роль доступа, чтобы она появилась у него в рабочем списке.',
      assignAccess: 'Назначить доступ',
      securityModel: 'Security model',
      roles: 'Роли',
      permissionsKicker: 'Permissions',
      permissionsTitle: 'Permissions',
      authHistoryKicker: 'Authorization log',
      authHistoryTitle: 'История авторизации пользователей',
      authHistoryLead: 'Общий журнал событий авторизации, обновления токенов и ошибок входа по всем учетным записям.',
      authHistoryColumns: {
        time: 'Время',
        username: 'Пользователь',
        event: 'Событие',
        status: 'Статус',
        client: 'Клиент',
        ip: 'IP адрес',
        details: 'Детали'
      },
      authHistorySuccess: 'Успешно',
      authHistoryFailed: 'Ошибка',
      authHistoryUnknown: 'не указан',
      authHistoryEmpty: 'без деталей',
      authHistoryEmptyState: 'События авторизации пока отсутствуют.',
      accessRoles: {
        owner: 'owner',
        operator: 'operator',
        viewer: 'viewer'
      },
      configSaved: 'Конфигурация {key} обновлена',
      approvalAccepted: 'Заявка {paymentNumber} подтверждена администратором',
      approvalRejected: 'Заявка {paymentNumber} отклонена',
      rejectReasonTitle: 'Причина отклонения заявки',
      rejectReasonLead: 'Укажите комментарий для заявки {paymentNumber}. Причина будет сохранена в журнале согласования и истории шагов.',
      rejectReasonPlaceholder: 'Например: недостаточно подтверждающих документов, некорректная сумма или нарушение лимитов.',
      submitRejectReason: 'Отклонить заявку',
      rejectCommentRequired: 'Укажите причину отклонения заявки',
      rolesSaved: 'Роли пользователя {username} обновлены',
      companyAccessSaved: 'Связка пользователь-компания сохранена',
      fallbackNewUser: 'новый пользователь',
      fallbackNewRole: 'новая роль',
      fallbackNewPermission: 'новое permission',
      fallbackNewCompany: 'новая компания',
      errorContexts: {
        loadData: 'загрузка административных данных',
        configSave: 'сохранение конфигурации {key}',
        approve: 'подтверждение заявки {paymentNumber}',
        reject: 'отклонение заявки {paymentNumber}',
        userCreate: 'создание пользователя {username}',
        userUpdate: 'обновление пользователя {username}',
        userDelete: 'удаление пользователя {username}',
        roleCreate: 'создание роли {code}',
        roleUpdate: 'обновление роли {code}',
        roleDelete: 'удаление роли {code}',
        permissionCreate: 'создание permission {code}',
        permissionUpdate: 'обновление permission {code}',
        permissionDelete: 'удаление permission {code}',
        companyAccessSave: 'назначение доступа user={userId}, company={companyId}',
        companyCreate: 'создание компании {companyName}',
        companyDelete: 'удаление компании {companyName}'
      },
      errorDialog: {
        kicker: 'backend error',
        title: 'Сообщить об ошибке',
        reportAction: 'Отправить в обращения',
        reporting: 'Отправка...',
        ticketCreated: 'Заявка по ошибке создана и передана в обращения.',
        reportFailed: 'Не удалось отправить ошибку в обращения',
        ticketSummary: 'Автоматическое сообщение об ошибке backend',
        ticketSubject: 'Ошибка backend: {context}',
        contextLabel: 'Контекст',
        timeLabel: 'Время',
        messageLabel: 'Текст ошибки',
        backendLabel: 'Ответ backend'
      }
    }
  },
  participants: {
    kicker: 'Participant registry',
    title: 'Участники и гарантийный фонд',
    addKicker: 'Add participant',
    addTitle: 'Новый участник',
    addButton: 'Добавить',
    placeholders: {
      code: 'Код',
      name: 'Наименование',
      category: 'Категория',
      risk: 'Риск',
      fund: 'Гарантийный фонд',
      status: 'Статус',
      country: 'Страна'
    },
    registryKicker: 'Registry',
    registryTitle: 'Справочник участников',
    columns: {
      code: 'Код',
      name: 'Наименование',
      category: 'Категория',
      risk: 'Риск',
      fund: 'Фонд',
      status: 'Статус'
    }
  },
  transactions: {
    kicker: 'Transactions & callbacks',
    title: 'Проводки и callback delivery',
    transactionsKicker: 'Transactions',
    transactionsTitle: 'Поток проводок',
    webhooksKicker: 'Webhook registry',
    webhooksTitle: 'Подписки интеграций',
    sendTest: 'Send test',
    webhookError: 'Webhook error'
  },
  settlements: {
    headerKicker: 'Settlement factory',
    title: 'Расчеты и статусы исполнения',
    manualKicker: 'Manual entry',
    manualTitle: 'Ручное заполнение транзакции',
    create: 'Создать',
    creating: 'Создание...',
    participant: 'Участник',
    selectParticipant: 'Выберите участника',
    clearingMethod: 'Тип клиринга',
    processingMode: 'Режим обработки',
    applicationArea: 'Область применения',
    automationLevel: 'Автоматизация',
    instrument: 'Инструмент',
    amount: 'Сумма',
    currency: 'Валюта',
    settlementDate: 'Дата расчета',
    netting: 'Неттинг',
    priority: 'Приоритет',
    clearingAccount: 'Клиринговый счет',
    batchWindow: 'Пакетное окно',
    batchCount: 'Количество операций в пакете',
    uploadKicker: 'Registry upload',
    uploadTitle: 'Загрузка Excel/CSV реестра',
    uploadAction: 'Выбрать файл реестра',
    uploadLoading: 'Идет загрузка...',
    previewKicker: 'Preview',
    previewTitle: 'Строки последнего реестра',
    bookKicker: 'Book',
    bookTitle: 'Список инструкций',
    columns: {
      id: 'ID',
      participant: 'Участник',
      clearing: 'Тип клиринга',
      mode: 'Режим',
      instrument: 'Инструмент',
      account: 'Клиринговый счет',
      amount: 'Сумма',
      status: 'Статус',
      date: 'Дата',
      actions: 'Действия'
    },
    confirm: 'Confirm',
    cancel: 'Cancel',
    gross: 'Брутто-клиринг',
    net: 'Нетто-клиринг',
    realtime: 'В реальном времени',
    batch: 'Пакетный',
    instruments: {
      topUp: 'Пополнить',
      transfer: 'Перевести',
      debit: 'Списать'
    },
    areas: {
      banking: 'Банковский',
      payment: 'Платежный',
      corporate: 'Корпоративный',
      exchange: 'Биржевой'
    },
    automation: {
      manual: 'Ручной',
      automated: 'Автоматизированный'
    },
    registryHint: 'Формат таблицы: `participantCode`, `instrument`, `amount`, `currency`, `settlementDate`, `clearingMethod`, `processingMode`, `applicationArea`, `automationLevel`, `nettingPosition`, `priority`, `batchWindow`, `batchOperationCount`.',
    registryHintRu: 'Допускаются и русские заголовки: Код участника, Инструмент, Сумма, Валюта, Дата расчета, Тип клиринга, Режим обработки, Область применения, Автоматизация, Неттинг, Приоритет, Пакетное окно, Количество операций.',
    registryHintRules: 'Для типа клиринга используй gross или net, для режима обработки realtime или batch. Клиринговый счет подставляется автоматически по участнику.',
    registryUploadError: 'В реестре не найдено валидных строк для загрузки',
    registryUploadSuccess: 'Загружено строк: {count}'
  }
}

function getByPath(source, path) {
  return path.split('.').reduce((accumulator, segment) => accumulator?.[segment], source)
}

function interpolate(text, params = {}) {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? `{${key}}`))
}

export function t(path, params) {
  const value = getByPath(ru, path)
  if (typeof value === 'string') {
    return interpolate(value, params)
  }
  return value
}
