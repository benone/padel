const { v4: uuidv4 } = require('uuid');

// Mock Users Data
const users = [
  {
    id: "12345",
    email: "kirill.romanov@example.com",
    phone: "+7 (999) 123-45-67",
    name: "Кирилл Романов",
    avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20businessman%20headshot%20portrait&width=100&height=100",
    level: 7.5,
    levelName: "Продвинутый",
    location: {
      lat: 55.7558,
      lng: 37.6176,
      address: "Москва"
    },
    age: 28,
    stats: {
      totalMatches: 47,
      wins: 32,
      losses: 15,
      winRate: 68,
      totalHours: 94,
      currentStreak: 3,
      favoritePartners: 12,
      clubsVisited: 8,
      averageMatchDuration: 85
    },
    preferences: {
      hand: "Правша",
      position: "Справа",
      preferredTime: "Вечер",
      playingStyle: "Атакующий"
    },
    createdAt: "2023-01-15T09:30:00Z",
    lastActive: "2024-01-15T14:22:00Z"
  },
  {
    id: "user_456",
    email: "alexey.petrov@example.com",
    phone: "+7 (999) 234-56-78",
    name: "Алексей Петров",
    avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
    level: 7.2,
    levelName: "Продвинутый",
    location: {
      lat: 55.7758,
      lng: 37.6376,
      address: "Москва"
    },
    age: 32,
    stats: {
      totalMatches: 43,
      wins: 28,
      losses: 15,
      winRate: 65,
      totalHours: 86,
      currentStreak: 2,
      favoritePartners: 8,
      clubsVisited: 5,
      averageMatchDuration: 90
    },
    preferences: {
      hand: "Правша",
      position: "Слева",
      preferredTime: "Утром",
      playingStyle: "Защитный"
    },
    createdAt: "2023-03-20T10:15:00Z",
    lastActive: "2024-01-15T16:30:00Z"
  },
  {
    id: "user_789",
    email: "maria.ivanova@example.com",
    phone: "+7 (999) 345-67-89",
    name: "Мария Иванова",
    avatar: null, // Test case for no avatar
    level: 6.8,
    levelName: "Средний",
    location: {
      lat: 55.7358,
      lng: 37.5976,
      address: "Москва"
    },
    age: 25,
    stats: {
      totalMatches: 32,
      wins: 20,
      losses: 12,
      winRate: 62,
      totalHours: 64,
      currentStreak: 1,
      favoritePartners: 6,
      clubsVisited: 4,
      averageMatchDuration: 80
    },
    preferences: {
      hand: "Левша",
      position: "Справа",
      preferredTime: "Вечер",
      playingStyle: "Универсальный"
    },
    createdAt: "2023-05-10T14:22:00Z",
    lastActive: "2024-01-15T18:45:00Z"
  }
];

// Mock Clubs Data
const clubs = [
  {
    id: "club_123",
    name: "Теннисный клуб Олимп",
    description: "Современный спортивный комплекс с профессиональными кортами для падела и тенниса",
    address: {
      street: "ул. Спортивная, 15",
      city: "Москва",
      district: "Центральный район",
      coordinates: {
        lat: 55.7558,
        lng: 37.6176
      }
    },
    contact: {
      phone: "+7 (495) 123-45-67",
      email: "info@olimp-club.ru",
      website: "https://olimp-club.ru"
    },
    images: [
      "http://localhost:3000/api/static-images/court-background-1",
      "http://localhost:3000/api/static-images/court-background-2"
    ],
    sports: [
      {
        name: "Падел",
        courts: 4,
        pricePerHour: 2500
      },
      {
        name: "Теннис",
        courts: 6,
        pricePerHour: 3000
      }
    ],
    amenities: {
      parking: true,
      wheelchairAccessible: true,
      cafe: true,
      lockerRoom: true,
      shower: true,
      equipment: true,
      lighting: "LED",
      surface: "Искусственная трава"
    },
    workingHours: {
      monday: { open: "07:00", close: "23:00" },
      tuesday: { open: "07:00", close: "23:00" },
      wednesday: { open: "07:00", close: "23:00" },
      thursday: { open: "07:00", close: "23:00" },
      friday: { open: "07:00", close: "23:00" },
      saturday: { open: "08:00", close: "22:00" },
      sunday: { open: "08:00", close: "22:00" }
    },
    rating: 4.8,
    reviewCount: 324,
    distance: 2.3
  },
  {
    id: "club_456",
    name: "Спорт Арена",
    description: "Профессиональный спортивный комплекс с современным оборудованием",
    address: {
      street: "пр. Победы, 42",
      city: "Москва",
      district: "Северный район",
      coordinates: {
        lat: 55.7858,
        lng: 37.6376
      }
    },
    contact: {
      phone: "+7 (495) 987-65-43",
      email: "info@sport-arena.ru",
      website: "https://sport-arena.ru"
    },
    images: [
      "http://localhost:3000/api/static-images/club-facility-1"
    ],
    sports: [
      {
        name: "Падел",
        courts: 6,
        pricePerHour: 2200
      }
    ],
    amenities: {
      parking: true,
      wheelchairAccessible: false,
      cafe: false,
      lockerRoom: true,
      shower: true,
      equipment: true,
      lighting: "LED",
      surface: "Искусственная трава"
    },
    workingHours: {
      monday: { open: "06:00", close: "24:00" },
      tuesday: { open: "06:00", close: "24:00" },
      wednesday: { open: "06:00", close: "24:00" },
      thursday: { open: "06:00", close: "24:00" },
      friday: { open: "06:00", close: "24:00" },
      saturday: { open: "07:00", close: "23:00" },
      sunday: { open: "07:00", close: "23:00" }
    },
    rating: 4.5,
    reviewCount: 187,
    distance: 4.7
  }
];

// Mock Matches Data
const matches = [
  {
    id: "match_456",
    sport: "Падел",
    date: "2024-01-20T18:00:00Z",
    duration: 90,
    level: "Средний",
    levelRange: [6.0, 8.0],
    type: "Парный",
    playersNeeded: 2,
    totalPlayers: 4,
    price: 1250,
    pricePerPerson: true,
    competitive: false,
    genderPreference: "mixed",
    description: "Дружеская игра в падел для игроков среднего уровня. Приглашаем активных и позитивных игроков!",
    club: {
      id: "club_123",
      name: "Теннисный клуб Олимп",
      address: "ул. Спортивная, 15",
      distance: 2.3,
      phone: "+7 (495) 123-45-67",
      coordinates: {
        lat: 55.7558,
        lng: 37.6176
      }
    },
    organizer: {
      id: "user_456",
      name: "Алексей Петров",
      avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
      level: 7.2,
      matchesPlayed: 43,
      rating: 4.9
    },
    players: [
      {
        id: "user_456",
        name: "Алексей Петров",
        avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
        level: 7.2,
        confirmed: true,
        role: "organizer"
      },
      {
        id: "user_789",
        name: "Мария Иванова",
        avatar: null, // Test missing avatar
        level: 6.8,
        confirmed: true,
        role: "player"
      }
    ],
    availableSpots: [
      { position: 3, role: "player" },
      { position: 4, role: "player" }
    ],
    courtBooked: true,
    courtInfo: {
      courtId: "court_2",
      courtName: "Корт 2",
      surface: "Искусственная трава"
    },
    status: "open",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    cancellationPolicy: "Отмена возможна за 24 часа до начала игры"
  },
  {
    id: "match_789",
    sport: "Падел",
    date: "2024-01-20T20:00:00Z",
    duration: 90,
    level: "Продвинутый",
    levelRange: [7.5, 9.0],
    type: "Парный",
    playersNeeded: 3,
    totalPlayers: 4,
    price: 1500,
    pricePerPerson: true,
    competitive: true,
    genderPreference: "male",
    club: {
      id: "club_456",
      name: "Спорт Арена",
      address: "пр. Победы, 42",
      distance: 4.7
    },
    organizer: {
      id: "user_102",
      name: "Дмитрий Козлов",
      avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
      level: 8.1
    },
    players: [
      {
        id: "user_102",
        name: "Дмитрий Козлов",
        level: 8.1,
        confirmed: true
      }
    ],
    courtBooked: false,
    createdAt: "2024-01-18T14:20:00Z"
  }
];

// Add a user with missing data for testing
users.push({
  id: "user_test",
  email: "test@example.com",
  phone: "+7 (999) 000-00-00",
  name: "", // Empty name
  avatar: "http://localhost:3000/api/images-simple/generate?prompt=young%20athlete%20beginner%20headshot%20portrait&width=100&height=100", // AI generated test user
  level: 5.0,
  levelName: "Начинающий",
  location: {
    lat: 55.7558,
    lng: 37.6176,
    address: "Москва"
  },
  age: 25,
  stats: {
    totalMatches: 5,
    wins: 2,
    losses: 3,
    winRate: 40,
    totalHours: 10,
    currentStreak: 0,
    favoritePartners: 1,
    clubsVisited: 1,
    averageMatchDuration: 90
  },
  preferences: {
    hand: "Правша",
    position: "Справа",
    preferredTime: "Утром",
    playingStyle: "Начинающий"
  },
  createdAt: "2024-01-01T10:00:00Z",
  lastActive: "2024-01-15T12:00:00Z"
});

// Add missing user from matches data
users.push({
  id: "user_102",
  email: "dmitry.kozlov@example.com",
  phone: "+7 (999) 555-12-34",
  name: "Дмитрий Козлов",
  avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
  level: 8.1,
  levelName: "Эксперт",
  location: {
    lat: 55.7458,
    lng: 37.6276,
    address: "Москва"
  },
  age: 29,
  stats: {
    totalMatches: 67,
    wins: 48,
    losses: 19,
    winRate: 72,
    totalHours: 134,
    currentStreak: 5,
    favoritePartners: 15,
    clubsVisited: 12,
    averageMatchDuration: 95
  },
  preferences: {
    hand: "Правша",
    position: "Слева",
    preferredTime: "Вечер",
    playingStyle: "Агрессивный"
  },
  createdAt: "2023-02-10T08:45:00Z",
  lastActive: "2024-01-15T20:15:00Z"
});

// Mock Bookings Data
const bookings = [
  {
    id: "booking_123",
    confirmationCode: "PB240120001",
    status: "confirmed",
    club: {
      id: "club_123",
      name: "Теннисный клуб Олимп",
      address: "ул. Спортивная, 15",
      phone: "+7 (495) 123-45-67"
    },
    court: {
      id: "court_2",
      name: "Корт 2"
    },
    user: {
      id: "12345",
      name: "Кирилл Романов",
      phone: "+7 (999) 123-45-67"
    },
    date: "2024-01-20",
    time: "18:00",
    duration: 90,
    sport: "Падел",
    totalPrice: 3000,
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: "2024-01-19T15:30:00Z",
    instructions: "Приходите за 15 минут до начала. Вход со стороны парковки."
  }
];

// Mock Sports Data
const sports = [
  {
    id: "padel",
    name: "Падел",
    icon: "🎾",
    description: "Популярная ракеточная игра в паре на закрытом корте",
    playersPerMatch: [2, 4],
    typicalDuration: 90,
    equipment: ["Ракетка", "Мяч"],
    popular: true
  },
  {
    id: "tennis",
    name: "Теннис",
    icon: "🎾",
    description: "Классический теннис на открытых и закрытых кортах",
    playersPerMatch: [2, 4],
    typicalDuration: 90,
    equipment: ["Ракетка", "Мяч"],
    popular: true
  },
  {
    id: "badminton",
    name: "Бадминтон",
    icon: "🏸",
    description: "Быстрая игра с воланом в зале",
    playersPerMatch: [2, 4],
    typicalDuration: 60,
    equipment: ["Ракетка", "Волан"],
    popular: false
  }
];

// Mock Time Slots Data
const timeSlots = [
  {
    time: "07:00",
    endTime: "08:30",
    duration: 90,
    period: "morning",
    popular: false
  },
  {
    time: "08:30",
    endTime: "10:00",
    duration: 90,
    period: "morning",
    popular: false
  },
  {
    time: "10:00",
    endTime: "11:30",
    duration: 90,
    period: "morning",
    popular: false
  },
  {
    time: "18:00",
    endTime: "19:30",
    duration: 90,
    period: "evening",
    popular: true
  },
  {
    time: "19:30",
    endTime: "21:00",
    duration: 90,
    period: "evening",
    popular: true
  },
  {
    time: "21:00",
    endTime: "22:30",
    duration: 90,
    period: "evening",
    popular: false
  }
];

// Generate mock court availability
const generateCourtAvailability = (date, sport = 'padel') => {
  const courts = [
    { id: "court_1", name: "Корт 1", price: 2500 },
    { id: "court_2", name: "Корт 2", price: 2500 },
    { id: "court_3", name: "Корт 3", price: 2500 },
    { id: "court_4", name: "Корт 4", price: 2500 }
  ];

  return timeSlots.map(slot => ({
    time: slot.time,
    duration: slot.duration,
    courts: courts.map(court => ({
      ...court,
      available: Math.random() > 0.3, // 70% chance of being available
      price: slot.popular ? court.price + 500 : court.price
    }))
  }));
};

// Generate user match history
const generateMatchHistory = (userId, limit = 10) => {
  const matches = [];
  for (let i = 0; i < limit; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    matches.push({
      id: `match_${uuidv4()}`,
      date: date.toISOString(),
      sport: "Падел",
      duration: 90,
      result: Math.random() > 0.5 ? "win" : "loss",
      score: Math.random() > 0.5 ? "6-3, 6-4" : "4-6, 3-6",
      club: {
        id: "club_123",
        name: "Теннисный клуб Олимп",
        location: "Москва, ул. Спортивная 15"
      },
      partners: [
        {
          id: "user_456",
          name: "Алексей Петров",
          avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
          level: 7.0
        }
      ],
      opponents: [
        {
          id: "user_789",
          name: "Михаил Иванов",
          avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
          level: 6.5
        },
        {
          id: "user_101",
          name: "Дмитрий Сидоров",
          avatar: "http://localhost:3000/api/images-simple/generate?prompt=padel%20tennis%20player%20athlete%20male%20headshot%20portrait&width=100&height=100",
          level: 7.2
        }
      ]
    });
  }
  return matches.sort((a, b) => new Date(b.date) - new Date(a.date));
};

// Generate user statistics
const generateUserStats = (userId, period = '6months') => {
  return {
    period,
    overview: {
      totalMatches: 47,
      wins: 32,
      losses: 15,
      winRate: 68,
      totalHours: 94,
      averageMatchDuration: 85
    },
    monthlyActivity: [
      { month: "2023-08", matches: 6, hours: 12 },
      { month: "2023-09", matches: 8, hours: 16 },
      { month: "2023-10", matches: 9, hours: 18 },
      { month: "2023-11", matches: 7, hours: 14 },
      { month: "2023-12", matches: 8, hours: 16 },
      { month: "2024-01", matches: 9, hours: 18 }
    ],
    levelProgression: [
      { date: "2023-08-01", level: 6.8 },
      { date: "2023-10-01", level: 7.1 },
      { date: "2023-12-01", level: 7.3 },
      { date: "2024-01-01", level: 7.5 }
    ],
    frequentPartners: [
      {
        id: "user_456",
        name: "Алексей Петров",
        avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
        matchesPlayed: 12,
        winRate: 75
      },
      {
        id: "user_789",
        name: "Игорь Волков",
        avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
        matchesPlayed: 8,
        winRate: 62
      }
    ]
  };
};

module.exports = {
  users,
  clubs,
  matches,
  bookings,
  sports,
  timeSlots,
  generateCourtAvailability,
  generateMatchHistory,
  generateUserStats
};