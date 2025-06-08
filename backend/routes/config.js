const express = require('express');
const router = express.Router();
const { success, error } = require('../utils/responseHelper');

// Application configuration endpoint
router.get('/app', async (req, res) => {
  try {
    const appConfig = {
      sports: [
        {
          id: 'padel',
          name: 'Падел',
          icon: 'tennisball-outline',
          active: true,
          defaultDuration: 90,
          playerCounts: [2, 4],
          levelRanges: [
            { id: 'beginner', label: '0.49 - 1.49', min: 0.49, max: 1.49 },
            { id: 'intermediate', label: '1.50 - 2.49', min: 1.5, max: 2.49 },
            { id: 'advanced', label: '2.50 - 3.49', min: 2.5, max: 3.49 },
            { id: 'expert', label: '3.50 - 4.49', min: 3.5, max: 4.49 }
          ]
        },
        {
          id: 'tennis',
          name: 'Теннис',
          icon: 'tennisball-outline',
          active: false,
          defaultDuration: 60,
          playerCounts: [2, 4],
          levelRanges: [
            { id: 'beginner', label: '1.0 - 2.5', min: 1.0, max: 2.5 },
            { id: 'intermediate', label: '3.0 - 4.5', min: 3.0, max: 4.5 },
            { id: 'advanced', label: '5.0 - 6.0', min: 5.0, max: 6.0 }
          ]
        },
        {
          id: 'football',
          name: 'Футбол',
          icon: 'football-outline',
          active: false,
          defaultDuration: 90,
          playerCounts: [10, 22],
          levelRanges: [
            { id: 'amateur', label: 'Любительский', min: 1, max: 3 },
            { id: 'semipro', label: 'Полупрофессиональный', min: 4, max: 6 },
            { id: 'professional', label: 'Профессиональный', min: 7, max: 10 }
          ]
        }
      ],
      booking: {
        defaultDuration: 90,
        durations: [
          { value: 60, label: '60мин', price: 2000 },
          { value: 90, label: '90мин', price: 3000 },
          { value: 120, label: '120мин', price: 4000 }
        ],
        timeSlots: [
          '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
          '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
          '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
          '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
          '20:00', '20:30', '21:00', '21:30', '22:00'
        ],
        genderOptions: [
          { id: 'mixed', label: 'Все игроки' },
          { id: 'male', label: 'Только мужчины' },
          { id: 'female', label: 'Только женщины' }
        ],
        defaultPrice: 3000,
        pricePerHour: 2000
      },
      filters: {
        defaultSport: 'padel',
        defaultClubSelection: '2 клуба',
        defaultDateRange: 'Сб-Вс-Пн, 07'
      },
      ui: {
        tabAnimationDuration: 150,
        defaultLoadingTimeout: 2000,
        supportedImageFormats: ['jpg', 'jpeg', 'png', 'webp'],
        maxImageSizeMB: 10
      }
    };

    success(res, appConfig, 'Application configuration retrieved successfully');
  } catch (err) {
    console.error('Error getting app config:', err);
    error(res, 'Failed to get application configuration', 500);
  }
});

// Localization strings endpoint
router.get('/localization/:locale?', async (req, res) => {
  try {
    const locale = req.params.locale || 'ru';
    
    const localization = {
      common: {
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно!',
        cancel: 'Отмена',
        confirm: 'Подтвердить',
        save: 'Сохранить',
        delete: 'Удалить',
        edit: 'Изменить',
        back: 'Назад',
        next: 'Далее',
        close: 'Закрыть',
        share: 'Поделиться',
        search: 'Поиск',
        filter: 'Фильтр',
        all: 'Все',
        none: 'Нет',
        available: 'Доступно',
        unavailable: 'Недоступно'
      },
      booking: {
        courtBooked: 'Корт забронирован',
        bookingConfirmed: 'Бронирование подтверждено',
        confirmationCode: 'Код',
        bookingFailed: 'Не удалось создать бронирование',
        clubInfoFailed: 'Не удалось загрузить информацию о клубе'
      },
      match: {
        competitiveDescription: 'Результат этого матча будет засчитан в уровень',
        friendlyDescription: 'Результат этого матча не влияет на ваш уровень',
        waiting: 'Ожидание',
        you: '(Вы)'
      },
      profile: {
        comingSoon: 'Скоро будет доступно',
        notSpecified: 'Не указано'
      },
      errors: {
        networkError: 'Ошибка сети. Проверьте подключение к интернету.',
        serverError: 'Ошибка сервера. Попробуйте позже.',
        notFound: 'Запрашиваемый ресурс не найден.',
        unauthorized: 'Необходима авторизация.',
        forbidden: 'Доступ запрещен.',
        validationError: 'Проверьте правильность введенных данных.',
        unexpectedError: 'Произошла неожиданная ошибка.'
      }
    };

    success(res, localization, `Localization for ${locale} retrieved successfully`);
  } catch (err) {
    console.error('Error getting localization:', err);
    error(res, 'Failed to get localization strings', 500);
  }
});

// Pricing configuration endpoint
router.get('/pricing', async (req, res) => {
  try {
    const pricingConfig = {
      sports: {
        padel: {
          basePrice: 2000,
          pricePerHour: 2000,
          durations: [
            { minutes: 60, price: 2000, popular: false },
            { minutes: 90, price: 3000, popular: true },
            { minutes: 120, price: 4000, popular: false }
          ]
        },
        tennis: {
          basePrice: 1500,
          pricePerHour: 1500,
          durations: [
            { minutes: 60, price: 1500, popular: true },
            { minutes: 90, price: 2200, popular: false },
            { minutes: 120, price: 3000, popular: false }
          ]
        }
      },
      fees: {
        bookingFee: 50,
        cancellationFee: 200,
        lateFee: 500
      },
      discounts: {
        earlyBird: { percentage: 10, beforeHours: 10 },
        multipleBookings: { percentage: 15, minBookings: 3 },
        weekday: { percentage: 20, days: ['monday', 'tuesday', 'wednesday', 'thursday'] }
      },
      currency: '₽',
      taxRate: 0.0 // No tax for sports activities in Russia
    };

    success(res, pricingConfig, 'Pricing configuration retrieved successfully');
  } catch (err) {
    console.error('Error getting pricing config:', err);
    error(res, 'Failed to get pricing configuration', 500);
  }
});

// Business rules and validation endpoint
router.get('/business-rules', async (req, res) => {
  try {
    const businessRules = {
      booking: {
        maxAdvanceBookingDays: 30,
        minAdvanceBookingHours: 2,
        maxBookingsPerUser: 5,
        cancellationDeadlineHours: 4,
        allowDoubleBooking: false
      },
      match: {
        minPlayers: 2,
        maxPlayers: 4,
        defaultPlayerCount: 4,
        waitingListEnabled: true,
        maxWaitingListSize: 10,
        autoConfirmMinutes: 15
      },
      level: {
        minLevel: 0.0,
        maxLevel: 10.0,
        defaultLevel: 1.0,
        levelSteps: 0.01,
        reliabilityThreshold: 60
      },
      club: {
        maxDistance: 50, // km
        minRating: 1.0,
        maxRating: 5.0,
        requiresVerification: true
      }
    };

    success(res, businessRules, 'Business rules retrieved successfully');
  } catch (err) {
    console.error('Error getting business rules:', err);
    error(res, 'Failed to get business rules', 500);
  }
});

module.exports = router;