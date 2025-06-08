var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-Ri07xL/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// .wrangler/tmp/bundle-Ri07xL/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// node_modules/itty-router/index.mjs
var t = /* @__PURE__ */ __name(({ base: e = "", routes: t2 = [], ...r2 } = {}) => ({ __proto__: new Proxy({}, { get: /* @__PURE__ */ __name((r3, o2, a, s) => (r4, ...c) => t2.push([o2.toUpperCase?.(), RegExp(`^${(s = (e + r4).replace(/\/+(\/|$)/g, "$1")).replace(/(\/?\.?):(\w+)\+/g, "($1(?<$2>*))").replace(/(\/?\.?):(\w+)/g, "($1(?<$2>[^$1/]+?))").replace(/\./g, "\\.").replace(/(\/?)\*/g, "($1.*)?")}/*$`), c, s]) && a, "get") }), routes: t2, ...r2, async fetch(e2, ...o2) {
  let a, s, c = new URL(e2.url), n = e2.query = { __proto__: null };
  for (let [e3, t3] of c.searchParams) n[e3] = n[e3] ? [].concat(n[e3], t3) : t3;
  e: try {
    for (let t3 of r2.before || []) if (null != (a = await t3(e2.proxy ?? e2, ...o2))) break e;
    t: for (let [r3, n2, l, i] of t2) if ((r3 == e2.method || "ALL" == r3) && (s = c.pathname.match(n2))) {
      e2.params = s.groups || {}, e2.route = i;
      for (let t3 of l) if (null != (a = await t3(e2.proxy ?? e2, ...o2))) break t;
    }
  } catch (t3) {
    if (!r2.catch) throw t3;
    a = await r2.catch(t3, e2.proxy ?? e2, ...o2);
  }
  try {
    for (let t3 of r2.finally || []) a = await t3(a, e2.proxy ?? e2, ...o2) ?? a;
  } catch (t3) {
    if (!r2.catch) throw t3;
    a = await r2.catch(t3, e2.proxy ?? e2, ...o2);
  }
  return a;
} }), "t");
var r = /* @__PURE__ */ __name((e = "text/plain; charset=utf-8", t2) => (r2, o2 = {}) => {
  if (void 0 === r2 || r2 instanceof Response) return r2;
  const a = new Response(t2?.(r2) ?? r2, o2.url ? void 0 : o2);
  return a.headers.set("content-type", e), a;
}, "r");
var o = r("application/json; charset=utf-8", JSON.stringify);
var p = r("text/plain; charset=utf-8", String);
var f = r("text/html");
var u = r("image/jpeg");
var h = r("image/png");
var g = r("image/webp");

// data/mockData.js
var users = [
  {
    id: "12345",
    email: "kirill.romanov@example.com",
    phone: "+7 (999) 123-45-67",
    name: "\u041A\u0438\u0440\u0438\u043B\u043B \u0420\u043E\u043C\u0430\u043D\u043E\u0432",
    avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20businessman%20headshot%20portrait&width=100&height=100",
    level: 7.5,
    levelName: "\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0439",
    location: {
      lat: 55.7558,
      lng: 37.6176,
      address: "\u041C\u043E\u0441\u043A\u0432\u0430"
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
      hand: "\u041F\u0440\u0430\u0432\u0448\u0430",
      position: "\u0421\u043F\u0440\u0430\u0432\u0430",
      preferredTime: "\u0412\u0435\u0447\u0435\u0440",
      playingStyle: "\u0410\u0442\u0430\u043A\u0443\u044E\u0449\u0438\u0439"
    },
    createdAt: "2023-01-15T09:30:00Z",
    lastActive: "2024-01-15T14:22:00Z"
  },
  {
    id: "user_456",
    email: "alexey.petrov@example.com",
    phone: "+7 (999) 234-56-78",
    name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432",
    avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
    level: 7.2,
    levelName: "\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0439",
    location: {
      lat: 55.7758,
      lng: 37.6376,
      address: "\u041C\u043E\u0441\u043A\u0432\u0430"
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
      hand: "\u041F\u0440\u0430\u0432\u0448\u0430",
      position: "\u0421\u043B\u0435\u0432\u0430",
      preferredTime: "\u0423\u0442\u0440\u043E\u043C",
      playingStyle: "\u0417\u0430\u0449\u0438\u0442\u043D\u044B\u0439"
    },
    createdAt: "2023-03-20T10:15:00Z",
    lastActive: "2024-01-15T16:30:00Z"
  },
  {
    id: "user_789",
    email: "maria.ivanova@example.com",
    phone: "+7 (999) 345-67-89",
    name: "\u041C\u0430\u0440\u0438\u044F \u0418\u0432\u0430\u043D\u043E\u0432\u0430",
    avatar: null,
    // Test case for no avatar
    level: 6.8,
    levelName: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439",
    location: {
      lat: 55.7358,
      lng: 37.5976,
      address: "\u041C\u043E\u0441\u043A\u0432\u0430"
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
      hand: "\u041B\u0435\u0432\u0448\u0430",
      position: "\u0421\u043F\u0440\u0430\u0432\u0430",
      preferredTime: "\u0412\u0435\u0447\u0435\u0440",
      playingStyle: "\u0423\u043D\u0438\u0432\u0435\u0440\u0441\u0430\u043B\u044C\u043D\u044B\u0439"
    },
    createdAt: "2023-05-10T14:22:00Z",
    lastActive: "2024-01-15T18:45:00Z"
  }
];
var clubs = [
  {
    id: "club_123",
    name: "\u0422\u0435\u043D\u043D\u0438\u0441\u043D\u044B\u0439 \u043A\u043B\u0443\u0431 \u041E\u043B\u0438\u043C\u043F",
    description: "\u0421\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0439 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0441 \u0441 \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u043A\u043E\u0440\u0442\u0430\u043C\u0438 \u0434\u043B\u044F \u043F\u0430\u0434\u0435\u043B\u0430 \u0438 \u0442\u0435\u043D\u043D\u0438\u0441\u0430",
    address: {
      street: "\u0443\u043B. \u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F, 15",
      city: "\u041C\u043E\u0441\u043A\u0432\u0430",
      district: "\u0426\u0435\u043D\u0442\u0440\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0439\u043E\u043D",
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
        name: "\u041F\u0430\u0434\u0435\u043B",
        courts: 4,
        pricePerHour: 2500
      },
      {
        name: "\u0422\u0435\u043D\u043D\u0438\u0441",
        courts: 6,
        pricePerHour: 3e3
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
      surface: "\u0418\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u0430"
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
    name: "\u0421\u043F\u043E\u0440\u0442 \u0410\u0440\u0435\u043D\u0430",
    description: "\u041F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u044B\u0439 \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0441 \u0441 \u0441\u043E\u0432\u0440\u0435\u043C\u0435\u043D\u043D\u044B\u043C \u043E\u0431\u043E\u0440\u0443\u0434\u043E\u0432\u0430\u043D\u0438\u0435\u043C",
    address: {
      street: "\u043F\u0440. \u041F\u043E\u0431\u0435\u0434\u044B, 42",
      city: "\u041C\u043E\u0441\u043A\u0432\u0430",
      district: "\u0421\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0440\u0430\u0439\u043E\u043D",
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
        name: "\u041F\u0430\u0434\u0435\u043B",
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
      surface: "\u0418\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u0430"
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
var matches = [
  {
    id: "match_456",
    sport: "\u041F\u0430\u0434\u0435\u043B",
    date: "2024-01-20T18:00:00Z",
    duration: 90,
    level: "\u0421\u0440\u0435\u0434\u043D\u0438\u0439",
    levelRange: [6, 8],
    type: "\u041F\u0430\u0440\u043D\u044B\u0439",
    playersNeeded: 2,
    totalPlayers: 4,
    price: 1250,
    pricePerPerson: true,
    competitive: false,
    genderPreference: "mixed",
    description: "\u0414\u0440\u0443\u0436\u0435\u0441\u043A\u0430\u044F \u0438\u0433\u0440\u0430 \u0432 \u043F\u0430\u0434\u0435\u043B \u0434\u043B\u044F \u0438\u0433\u0440\u043E\u043A\u043E\u0432 \u0441\u0440\u0435\u0434\u043D\u0435\u0433\u043E \u0443\u0440\u043E\u0432\u043D\u044F. \u041F\u0440\u0438\u0433\u043B\u0430\u0448\u0430\u0435\u043C \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u0438 \u043F\u043E\u0437\u0438\u0442\u0438\u0432\u043D\u044B\u0445 \u0438\u0433\u0440\u043E\u043A\u043E\u0432!",
    club: {
      id: "club_123",
      name: "\u0422\u0435\u043D\u043D\u0438\u0441\u043D\u044B\u0439 \u043A\u043B\u0443\u0431 \u041E\u043B\u0438\u043C\u043F",
      address: "\u0443\u043B. \u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F, 15",
      distance: 2.3,
      phone: "+7 (495) 123-45-67",
      coordinates: {
        lat: 55.7558,
        lng: 37.6176
      }
    },
    organizer: {
      id: "user_456",
      name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432",
      avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
      level: 7.2,
      matchesPlayed: 43,
      rating: 4.9
    },
    players: [
      {
        id: "user_456",
        name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432",
        avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
        level: 7.2,
        confirmed: true,
        role: "organizer"
      },
      {
        id: "user_789",
        name: "\u041C\u0430\u0440\u0438\u044F \u0418\u0432\u0430\u043D\u043E\u0432\u0430",
        avatar: null,
        // Test missing avatar
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
      courtName: "\u041A\u043E\u0440\u0442 2",
      surface: "\u0418\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0442\u0440\u0430\u0432\u0430"
    },
    status: "open",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-18T16:45:00Z",
    cancellationPolicy: "\u041E\u0442\u043C\u0435\u043D\u0430 \u0432\u043E\u0437\u043C\u043E\u0436\u043D\u0430 \u0437\u0430 24 \u0447\u0430\u0441\u0430 \u0434\u043E \u043D\u0430\u0447\u0430\u043B\u0430 \u0438\u0433\u0440\u044B"
  },
  {
    id: "match_789",
    sport: "\u041F\u0430\u0434\u0435\u043B",
    date: "2024-01-20T20:00:00Z",
    duration: 90,
    level: "\u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0439",
    levelRange: [7.5, 9],
    type: "\u041F\u0430\u0440\u043D\u044B\u0439",
    playersNeeded: 3,
    totalPlayers: 4,
    price: 1500,
    pricePerPerson: true,
    competitive: true,
    genderPreference: "male",
    club: {
      id: "club_456",
      name: "\u0421\u043F\u043E\u0440\u0442 \u0410\u0440\u0435\u043D\u0430",
      address: "\u043F\u0440. \u041F\u043E\u0431\u0435\u0434\u044B, 42",
      distance: 4.7
    },
    organizer: {
      id: "user_102",
      name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041A\u043E\u0437\u043B\u043E\u0432",
      avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
      level: 8.1
    },
    players: [
      {
        id: "user_102",
        name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041A\u043E\u0437\u043B\u043E\u0432",
        level: 8.1,
        confirmed: true
      }
    ],
    courtBooked: false,
    createdAt: "2024-01-18T14:20:00Z"
  }
];
users.push({
  id: "user_test",
  email: "test@example.com",
  phone: "+7 (999) 000-00-00",
  name: "",
  // Empty name
  avatar: "http://localhost:3000/api/images-simple/generate?prompt=young%20athlete%20beginner%20headshot%20portrait&width=100&height=100",
  // AI generated test user
  level: 5,
  levelName: "\u041D\u0430\u0447\u0438\u043D\u0430\u044E\u0449\u0438\u0439",
  location: {
    lat: 55.7558,
    lng: 37.6176,
    address: "\u041C\u043E\u0441\u043A\u0432\u0430"
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
    hand: "\u041F\u0440\u0430\u0432\u0448\u0430",
    position: "\u0421\u043F\u0440\u0430\u0432\u0430",
    preferredTime: "\u0423\u0442\u0440\u043E\u043C",
    playingStyle: "\u041D\u0430\u0447\u0438\u043D\u0430\u044E\u0449\u0438\u0439"
  },
  createdAt: "2024-01-01T10:00:00Z",
  lastActive: "2024-01-15T12:00:00Z"
});
users.push({
  id: "user_102",
  email: "dmitry.kozlov@example.com",
  phone: "+7 (999) 555-12-34",
  name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u041A\u043E\u0437\u043B\u043E\u0432",
  avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
  level: 8.1,
  levelName: "\u042D\u043A\u0441\u043F\u0435\u0440\u0442",
  location: {
    lat: 55.7458,
    lng: 37.6276,
    address: "\u041C\u043E\u0441\u043A\u0432\u0430"
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
    hand: "\u041F\u0440\u0430\u0432\u0448\u0430",
    position: "\u0421\u043B\u0435\u0432\u0430",
    preferredTime: "\u0412\u0435\u0447\u0435\u0440",
    playingStyle: "\u0410\u0433\u0440\u0435\u0441\u0441\u0438\u0432\u043D\u044B\u0439"
  },
  createdAt: "2023-02-10T08:45:00Z",
  lastActive: "2024-01-15T20:15:00Z"
});
var bookings = [
  {
    id: "booking_123",
    confirmationCode: "PB240120001",
    status: "confirmed",
    club: {
      id: "club_123",
      name: "\u0422\u0435\u043D\u043D\u0438\u0441\u043D\u044B\u0439 \u043A\u043B\u0443\u0431 \u041E\u043B\u0438\u043C\u043F",
      address: "\u0443\u043B. \u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F, 15",
      phone: "+7 (495) 123-45-67"
    },
    court: {
      id: "court_2",
      name: "\u041A\u043E\u0440\u0442 2"
    },
    user: {
      id: "12345",
      name: "\u041A\u0438\u0440\u0438\u043B\u043B \u0420\u043E\u043C\u0430\u043D\u043E\u0432",
      phone: "+7 (999) 123-45-67"
    },
    date: "2024-01-20",
    time: "18:00",
    duration: 90,
    sport: "\u041F\u0430\u0434\u0435\u043B",
    totalPrice: 3e3,
    paymentStatus: "paid",
    paymentMethod: "card",
    createdAt: "2024-01-19T15:30:00Z",
    instructions: "\u041F\u0440\u0438\u0445\u043E\u0434\u0438\u0442\u0435 \u0437\u0430 15 \u043C\u0438\u043D\u0443\u0442 \u0434\u043E \u043D\u0430\u0447\u0430\u043B\u0430. \u0412\u0445\u043E\u0434 \u0441\u043E \u0441\u0442\u043E\u0440\u043E\u043D\u044B \u043F\u0430\u0440\u043A\u043E\u0432\u043A\u0438."
  }
];
var sports = [
  {
    id: "padel",
    name: "\u041F\u0430\u0434\u0435\u043B",
    icon: "\u{1F3BE}",
    description: "\u041F\u043E\u043F\u0443\u043B\u044F\u0440\u043D\u0430\u044F \u0440\u0430\u043A\u0435\u0442\u043E\u0447\u043D\u0430\u044F \u0438\u0433\u0440\u0430 \u0432 \u043F\u0430\u0440\u0435 \u043D\u0430 \u0437\u0430\u043A\u0440\u044B\u0442\u043E\u043C \u043A\u043E\u0440\u0442\u0435",
    playersPerMatch: [2, 4],
    typicalDuration: 90,
    equipment: ["\u0420\u0430\u043A\u0435\u0442\u043A\u0430", "\u041C\u044F\u0447"],
    popular: true
  },
  {
    id: "tennis",
    name: "\u0422\u0435\u043D\u043D\u0438\u0441",
    icon: "\u{1F3BE}",
    description: "\u041A\u043B\u0430\u0441\u0441\u0438\u0447\u0435\u0441\u043A\u0438\u0439 \u0442\u0435\u043D\u043D\u0438\u0441 \u043D\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u044B\u0445 \u0438 \u0437\u0430\u043A\u0440\u044B\u0442\u044B\u0445 \u043A\u043E\u0440\u0442\u0430\u0445",
    playersPerMatch: [2, 4],
    typicalDuration: 90,
    equipment: ["\u0420\u0430\u043A\u0435\u0442\u043A\u0430", "\u041C\u044F\u0447"],
    popular: true
  },
  {
    id: "badminton",
    name: "\u0411\u0430\u0434\u043C\u0438\u043D\u0442\u043E\u043D",
    icon: "\u{1F3F8}",
    description: "\u0411\u044B\u0441\u0442\u0440\u0430\u044F \u0438\u0433\u0440\u0430 \u0441 \u0432\u043E\u043B\u0430\u043D\u043E\u043C \u0432 \u0437\u0430\u043B\u0435",
    playersPerMatch: [2, 4],
    typicalDuration: 60,
    equipment: ["\u0420\u0430\u043A\u0435\u0442\u043A\u0430", "\u0412\u043E\u043B\u0430\u043D"],
    popular: false
  }
];
var timeSlots = [
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
var generateCourtAvailability = /* @__PURE__ */ __name((date, sport = "padel") => {
  const courts = [
    { id: "court_1", name: "\u041A\u043E\u0440\u0442 1", price: 2500 },
    { id: "court_2", name: "\u041A\u043E\u0440\u0442 2", price: 2500 },
    { id: "court_3", name: "\u041A\u043E\u0440\u0442 3", price: 2500 },
    { id: "court_4", name: "\u041A\u043E\u0440\u0442 4", price: 2500 }
  ];
  return timeSlots.map((slot) => ({
    time: slot.time,
    duration: slot.duration,
    courts: courts.map((court) => ({
      ...court,
      available: Math.random() > 0.3,
      // 70% chance of being available
      price: slot.popular ? court.price + 500 : court.price
    }))
  }));
}, "generateCourtAvailability");
var generateMatchHistory = /* @__PURE__ */ __name((userId, limit = 10) => {
  const matches2 = [];
  for (let i = 0; i < limit; i++) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    matches2.push({
      id: `match_${uuidv4()}`,
      date: date.toISOString(),
      sport: "\u041F\u0430\u0434\u0435\u043B",
      duration: 90,
      result: Math.random() > 0.5 ? "win" : "loss",
      score: Math.random() > 0.5 ? "6-3, 6-4" : "4-6, 3-6",
      club: {
        id: "club_123",
        name: "\u0422\u0435\u043D\u043D\u0438\u0441\u043D\u044B\u0439 \u043A\u043B\u0443\u0431 \u041E\u043B\u0438\u043C\u043F",
        location: "\u041C\u043E\u0441\u043A\u0432\u0430, \u0443\u043B. \u0421\u043F\u043E\u0440\u0442\u0438\u0432\u043D\u0430\u044F 15"
      },
      partners: [
        {
          id: "user_456",
          name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432",
          avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
          level: 7
        }
      ],
      opponents: [
        {
          id: "user_789",
          name: "\u041C\u0438\u0445\u0430\u0438\u043B \u0418\u0432\u0430\u043D\u043E\u0432",
          avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
          level: 6.5
        },
        {
          id: "user_101",
          name: "\u0414\u043C\u0438\u0442\u0440\u0438\u0439 \u0421\u0438\u0434\u043E\u0440\u043E\u0432",
          avatar: "http://localhost:3000/api/images-simple/generate?prompt=padel%20tennis%20player%20athlete%20male%20headshot%20portrait&width=100&height=100",
          level: 7.2
        }
      ]
    });
  }
  return matches2.sort((a, b) => new Date(b.date) - new Date(a.date));
}, "generateMatchHistory");
var generateUserStats = /* @__PURE__ */ __name((userId, period = "6months") => {
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
        name: "\u0410\u043B\u0435\u043A\u0441\u0435\u0439 \u041F\u0435\u0442\u0440\u043E\u0432",
        avatar: "http://localhost:3000/api/images-simple/generate?prompt=professional%20padel%20player%20male%20headshot%20portrait&width=100&height=100",
        matchesPlayed: 12,
        winRate: 75
      },
      {
        id: "user_789",
        name: "\u0418\u0433\u043E\u0440\u044C \u0412\u043E\u043B\u043A\u043E\u0432",
        avatar: "http://localhost:3000/api/images-simple/generate?prompt=experienced%20padel%20player%20expert%20male%20headshot%20portrait&width=100&height=100",
        matchesPlayed: 8,
        winRate: 62
      }
    ]
  };
}, "generateUserStats");
var mockData = {
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

// worker.js
var router = t();
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Content-Type": "application/json"
};
function sendSuccess(data, message = "Success", status = 200) {
  return new Response(JSON.stringify({
    success: true,
    message,
    data,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status,
    headers: corsHeaders
  });
}
__name(sendSuccess, "sendSuccess");
function sendError(message = "Error", status = 400, error = null) {
  return new Response(JSON.stringify({
    success: false,
    message,
    error: error?.message || error,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  }), {
    status,
    headers: corsHeaders
  });
}
__name(sendError, "sendError");
async function authenticateToken(request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  const token = authHeader.substring(7);
  if (token === "mock-token-12345") {
    return { id: "12345", email: "kirill.romanov@example.com" };
  } else if (token.startsWith("mock-token-")) {
    return { id: "user_456", email: "user@example.com" };
  }
  return null;
}
__name(authenticateToken, "authenticateToken");
router.get("/", () => {
  return sendSuccess({
    name: "Padel App Backend API (Cloudflare Workers)",
    version: "1.0.0",
    description: "Mock backend server for Padel booking and community app",
    endpoints: {
      users: "/api/users",
      clubs: "/api/clubs",
      matches: "/api/matches",
      bookings: "/api/bookings",
      auth: "/api/auth"
    },
    status: "running"
  }, "Padel App Backend API is running");
});
router.get("/api/health", () => {
  return sendSuccess({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: "N/A in Workers",
    memory: "N/A in Workers"
  }, "Service is healthy");
});
router.post("/api/auth/login", async (request) => {
  try {
    const body = await request.json();
    const { email, password } = body;
    if (!email || !password) {
      return sendError("Email and password are required", 400);
    }
    const mockToken = email === "kirill.romanov@example.com" ? "mock-token-12345" : "mock-token-generic";
    return sendSuccess({
      token: mockToken,
      user: {
        id: email === "kirill.romanov@example.com" ? "12345" : "user_456",
        email,
        name: email === "kirill.romanov@example.com" ? "\u041A\u0438\u0440\u0438\u043B\u043B \u0420\u043E\u043C\u0430\u043D\u043E\u0432" : "Mock User"
      },
      expiresIn: "7d"
    }, "Login successful");
  } catch (error) {
    return sendError("Login failed", 500, error);
  }
});
router.post("/api/auth/register", async (request) => {
  try {
    const body = await request.json();
    const { email, password, name, phone } = body;
    if (!email || !password || !name) {
      return sendError("Email, password, and name are required", 400);
    }
    const newUserId = `user_${Date.now()}`;
    const mockToken = `mock-token-${newUserId}`;
    return sendSuccess({
      token: mockToken,
      user: {
        id: newUserId,
        email,
        name,
        phone: phone || null
      },
      expiresIn: "7d"
    }, "Registration successful", 201);
  } catch (error) {
    return sendError("Registration failed", 500, error);
  }
});
router.get("/api/users/profile", async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError("Unauthorized", 401);
  }
  const userProfile = mockData.users.find((u2) => u2.id === user.id) || mockData.users[0];
  return sendSuccess(userProfile, "User profile retrieved successfully");
});
router.get("/api/users/:userId", async (request) => {
  const { userId } = request.params;
  const userProfile = mockData.users.find((u2) => u2.id === userId) || mockData.users[0];
  return sendSuccess(userProfile, "User profile retrieved successfully");
});
router.get("/api/users/:userId/stats", async (request) => {
  const { userId } = request.params;
  const userStats = mockData.userStats.find((s) => s.userId === userId) || mockData.userStats[0];
  return sendSuccess(userStats, "User stats retrieved successfully");
});
router.get("/api/clubs", async (request) => {
  const url = new URL(request.url);
  const city = url.searchParams.get("city");
  const search = url.searchParams.get("search");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  let filteredClubs = [...mockData.clubs];
  if (city) {
    filteredClubs = filteredClubs.filter(
      (club) => club.city.toLowerCase() === city.toLowerCase()
    );
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filteredClubs = filteredClubs.filter(
      (club) => club.name.toLowerCase().includes(searchLower) || club.city.toLowerCase().includes(searchLower)
    );
  }
  const paginatedClubs = filteredClubs.slice(offset, offset + limit);
  return sendSuccess({
    clubs: paginatedClubs,
    total: filteredClubs.length,
    hasMore: offset + limit < filteredClubs.length
  }, "Clubs retrieved successfully");
});
router.get("/api/clubs/:clubId", async (request) => {
  const { clubId } = request.params;
  const club = mockData.clubs.find((c) => c.id === clubId);
  if (!club) {
    return sendError("Club not found", 404);
  }
  return sendSuccess(club, "Club details retrieved successfully");
});
router.get("/api/matches/open", async (request) => {
  const url = new URL(request.url);
  const city = url.searchParams.get("city");
  const date = url.searchParams.get("date");
  const limit = parseInt(url.searchParams.get("limit") || "10");
  const offset = parseInt(url.searchParams.get("offset") || "0");
  let filteredMatches = mockData.matches.filter((match) => match.status === "open");
  if (city) {
    filteredMatches = filteredMatches.filter(
      (match) => match.location.city.toLowerCase() === city.toLowerCase()
    );
  }
  if (date) {
    filteredMatches = filteredMatches.filter(
      (match) => match.date.startsWith(date)
    );
  }
  const paginatedMatches = filteredMatches.slice(offset, offset + limit);
  return sendSuccess({
    matches: paginatedMatches,
    total: filteredMatches.length,
    hasMore: offset + limit < filteredMatches.length
  }, "Open matches retrieved successfully");
});
router.post("/api/matches", async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError("Unauthorized", 401);
  }
  try {
    const body = await request.json();
    const { clubId, courtId, date, time, duration, maxPlayers, skillLevel, description } = body;
    if (!clubId || !courtId || !date || !time) {
      return sendError("Club, court, date and time are required", 400);
    }
    const newMatch = {
      id: `match_${Date.now()}`,
      clubId,
      courtId,
      date,
      time,
      duration: duration || 90,
      organizerId: user.id,
      players: [{
        id: user.id,
        name: user.name || "Current User",
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.id}`,
        skillLevel: 3.5
      }],
      maxPlayers: maxPlayers || 4,
      skillLevel: skillLevel || "intermediate",
      description,
      status: "open",
      price: 1500,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    return sendSuccess(newMatch, "Match created successfully", 201);
  } catch (error) {
    return sendError("Failed to create match", 500, error);
  }
});
router.get("/api/bookings", async (request) => {
  const user = await authenticateToken(request);
  if (!user) {
    return sendError("Unauthorized", 401);
  }
  const userBookings = mockData.bookings.filter((b) => b.userId === user.id);
  return sendSuccess({
    bookings: userBookings,
    total: userBookings.length
  }, "Bookings retrieved successfully");
});
router.get("/api/static-images/:category/:imageName", async (request) => {
  const { category, imageName } = request.params;
  const imageUrl = `https://placehold.co/800x600/4f46e5/ffffff?text=${category}+${imageName}`;
  return new Response(null, {
    status: 302,
    headers: {
      "Location": imageUrl,
      ...corsHeaders
    }
  });
});
router.options("*", () => {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
});
router.all("*", () => {
  return sendError("Route not found", 404);
});
var worker_default = {
  fetch: router.fetch
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Ri07xL/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-Ri07xL/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=worker.js.map
