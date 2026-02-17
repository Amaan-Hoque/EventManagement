export interface User {
  userId: string;
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  role: 'admin' | 'user';
  location?: string;
}

export interface Event {
  eventId: string;
  name: string;
  category: string;
  location: string;
  date: string;
  time: string; // HH:mm format
  organizerId: string;
  description: string;
  price: number;
  image: string;
  totalTickets: number;
}

export interface Ticket {
  ticketId: string;
  eventId: string;
  userId: string;
  bookingDate: string;
  status: 'Confirmed' | 'Canceled';
}

export interface Feedback {
  feedbackId: string;
  eventId: string;
  userId: string;
  rating: number;
  comments: string;
  submittedTimestamp: string;
}

export const MOCK_USERS: User[] = [
  {
    userId: 'u1',
    name: 'Admin User',
    email: 'admin@test.com',
    password: '123456',
    contactNumber: '1234567890',
    role: 'admin',
    location: 'New York, NY',
  },
  {
    userId: 'u2',
    name: 'John Doe',
    email: 'john@test.com',
    password: '123456',
    contactNumber: '0987654321',
    role: 'user',
    location: 'New York, NY',
  },
  {
    userId: 'u3',
    name: 'Emily Davis',
    email: 'emily@test.com',
    password: '123456',
    contactNumber: '1122334455',
    role: 'user',
    location: 'Boston, MA',
  },
  {
    userId: 'u4',
    name: 'Michael Chen',
    email: 'michael@test.com',
    password: '123456',
    contactNumber: '2233445566',
    role: 'user',
    location: 'Austin, TX',
  },
  {
    userId: 'u5',
    name: 'Sarah Connor',
    email: 'sarah@test.com',
    password: '123456',
    contactNumber: '3344556677',
    role: 'user',
    location: 'Los Angeles, CA',
  },
  {
    userId: 'u6',
    name: 'David Miller',
    email: 'david@test.com',
    password: '123456',
    contactNumber: '4455667788',
    role: 'user',
    location: 'Chicago, IL',
  },
  {
    userId: 'u7',
    name: 'Jessica Pearson',
    email: 'jessica@test.com',
    password: '123456',
    contactNumber: '5566778899',
    role: 'user',
    location: 'New York, NY',
  },
  {
    userId: 'u8',
    name: 'Louis Litt',
    email: 'louis@test.com',
    password: '123456',
    contactNumber: '6677889900',
    role: 'user',
    location: 'New York, NY',
  },
];

export const MOCK_EVENTS: Event[] = [
  //past events
  {
    eventId: 'e_past_1',
    name: 'Winter Tech Symposium 2024',
    category: 'Technology',
    location: 'Chicago, IL',
    date: '2024-02-15',
    time: '09:00',
    organizerId: 'u1',
    description: 'A deep dive into the cold realities of hardware manufacturing and chip design.',
    price: 450,
    image: 'https://picsum.photos/id/0/1000/600',
    totalTickets: 100,
  },
  {
    eventId: 'e_past_2',
    name: 'Indie Film Premiere Night',
    category: 'Arts',
    location: 'Los Angeles, CA',
    date: '2024-03-10',
    time: '19:30',
    organizerId: 'u1',
    description: 'Screening five award-winning independent films followed by a Q&A with directors.',
    price: 60,
    image: 'https://picsum.photos/id/10/1000/600',
    totalTickets: 100,
  },

  //future events
  {
    eventId: 'e1',
    name: 'Future of AI Summit 2025',
    category: 'Technology',
    location: 'San Francisco, CA',
    date: '2025-11-15',
    time: '08:00',
    organizerId: 'u1',
    description:
      'Join the leading minds in tech for a day of innovation, networking, and future-gazing keynotes on AGI.',
    price: 599,
    image: 'https://picsum.photos/id/20/1000/600',
    totalTickets: 200,
  },
  {
    eventId: 'e2',
    name: 'Global Music Festival 2025',
    category: 'Music',
    location: 'Boston, MA',
    date: '2025-07-20',
    time: '14:00',
    organizerId: 'u1',
    description:
      'A weekend of amazing live music from top artists across the globe. Experience the rhythm.',
    price: 150,
    image: 'https://picsum.photos/id/36/1000/600',
    totalTickets: 500,
  },
  {
    eventId: 'e3',
    name: 'Startup Networking Night',
    category: 'Business',
    location: 'New York, NY',
    date: '2025-08-10',
    time: '18:00',
    organizerId: 'u1',
    description:
      'Network with investors and fellow founders in an intimate setting. Pizza and drinks provided.',
    price: 0,
    image: 'https://picsum.photos/id/42/1000/600',
    totalTickets: 50,
  },
  {
    eventId: 'e4',
    name: 'Mars Colonization Expo',
    category: 'Science',
    location: 'Las Vegas, NV',
    date: '2026-01-15',
    time: '10:00',
    organizerId: 'u1',
    description:
      'Discussing the logistics, ethics, and engineering of the upcoming red planet colonization efforts.',
    price: 120,
    image: 'https://picsum.photos/id/54/1000/600',
    totalTickets: 150,
  },
  {
    eventId: 'e5',
    name: 'Sustainable Living Workshop',
    category: 'Lifestyle',
    location: 'Seattle, WA',
    date: '2025-10-05',
    time: '11:00',
    organizerId: 'u1',
    description:
      'Learn how to reduce your footprint with hands-on workshops on solar, composting, and minimalism.',
    price: 25,
    image: 'https://picsum.photos/id/60/1000/600',
    totalTickets: 30,
  },
  {
    eventId: 'e6',
    name: 'Quantum Computing Breakthroughs',
    category: 'Technology',
    location: 'Chicago, IL',
    date: '2025-12-05',
    time: '09:30',
    organizerId: 'u1',
    description:
      'Explore the latest advancements in quantum mechanics and computing power with industry experts.',
    price: 450,
    image: 'https://picsum.photos/id/72/1000/600',
    totalTickets: 80,
  },
  {
    eventId: 'e7',
    name: 'Underwater Art Exhibition',
    category: 'Arts',
    location: 'Miami, FL',
    date: '2026-02-14',
    time: '16:00',
    organizerId: 'u1',
    description:
      'A unique diving experience to view sculptures submerged in the ocean, supporting coral regrowth.',
    price: 200,
    image: 'https://picsum.photos/id/88/1000/600',
    totalTickets: 40,
  },
  {
    eventId: 'e8',
    name: 'Next-Gen Transportation',
    category: 'Science',
    location: 'San Jose, CA',
    date: '2025-09-18',
    time: '10:00',
    organizerId: 'u1',
    description: 'Flying cars, hyperloops, and autonomous drones. The future of movement is here.',
    price: 300,
    image: 'https://picsum.photos/id/96/1000/600',
    totalTickets: 120,
  },
  {
    eventId: 'e9',
    name: 'Global Fintech Forum',
    category: 'Business',
    location: 'Austin, TX',
    date: '2025-08-22',
    time: '09:00',
    organizerId: 'u1',
    description:
      'Connecting world leaders in finance and technology to discuss the future of money.',
    price: 500,
    image: 'https://picsum.photos/id/101/1000/600',
    totalTickets: 300,
  },
  {
    eventId: 'e10',
    name: 'Digital NFT Gala',
    category: 'Arts',
    location: 'New Orleans, LA',
    date: '2025-06-15',
    time: '20:00',
    organizerId: 'u1',
    description:
      'Showcasing the finest NFT and digital art collections in a physical gallery space.',
    price: 180,
    image: 'https://picsum.photos/id/111/1000/600',
    totalTickets: 100,
  },
  {
    eventId: 'e11',
    name: 'Robot Wars Championship',
    category: 'Technology',
    location: 'Dallas, TX',
    date: '2025-11-01',
    time: '15:00',
    organizerId: 'u1',
    description: 'Watch autonomous robots battle for supremacy in the ring. Sparks will fly!',
    price: 75,
    image: 'https://picsum.photos/id/119/1000/600',
    totalTickets: 250,
  },
  {
    eventId: 'e12',
    name: 'Zero Gravity Yoga',
    category: 'Lifestyle',
    location: 'Las Vegas, NV',
    date: '2026-03-20',
    time: '07:00',
    organizerId: 'u1',
    description: 'Experience mindfulness in a weightless environment. The ultimate relaxation.',
    price: 2500,
    image: 'https://picsum.photos/id/128/1000/600',
    totalTickets: 10,
  },
  {
    eventId: 'e13',
    name: 'Neuro-Link Symposium',
    category: 'Science',
    location: 'Denver, CO',
    date: '2026-05-10',
    time: '13:00',
    organizerId: 'u1',
    description: 'The latest research in brain-computer interfaces and expanding human memory.',
    price: 350,
    image: 'https://picsum.photos/id/133/1000/600',
    totalTickets: 100,
  },
  {
    eventId: 'e14',
    name: 'Cybersecurity Defense Con',
    category: 'Technology',
    location: 'Houston, TX',
    date: '2025-08-05',
    time: '10:30',
    organizerId: 'u1',
    description: 'Learn how to protect infrastructure from the next generation of digital threats.',
    price: 800,
    image: 'https://picsum.photos/id/145/1000/600',
    totalTickets: 150,
  },
  {
    eventId: 'e15',
    name: 'Culinary Masters: Fusion',
    category: 'Lifestyle',
    location: 'Philadelphia, PA',
    date: '2025-07-10',
    time: '19:00',
    organizerId: 'u1',
    description: 'Top chefs from Asia and Europe collide to create new flavor profiles.',
    price: 250,
    image: 'https://picsum.photos/id/163/1000/600',
    totalTickets: 60,
  },
];

export const MOCK_TICKETS: Ticket[] = [
  //past bookings
  {
    ticketId: 't1',
    eventId: 'e_past_1',
    userId: 'u2',
    bookingDate: '2023-12-01T10:00:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't2',
    eventId: 'e_past_1',
    userId: 'u3',
    bookingDate: '2023-12-05T14:30:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't3',
    eventId: 'e_past_1',
    userId: 'u4',
    bookingDate: '2024-01-10T09:00:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't4',
    eventId: 'e_past_2',
    userId: 'u2',
    bookingDate: '2024-02-01T11:00:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't5',
    eventId: 'e_past_2',
    userId: 'u5',
    bookingDate: '2024-02-15T15:00:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't6',
    eventId: 'e_past_2',
    userId: 'u6',
    bookingDate: '2024-02-20T10:00:00Z',
    status: 'Confirmed',
  },

  //future bookings
  {
    ticketId: 't7',
    eventId: 'e1',
    userId: 'u2',
    bookingDate: '2025-01-15T10:00:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't8',
    eventId: 'e2',
    userId: 'u2',
    bookingDate: '2025-03-20T14:30:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't9',
    eventId: 'e2',
    userId: 'u3',
    bookingDate: '2025-03-22T09:15:00Z',
    status: 'Canceled',
  },
  {
    ticketId: 't10',
    eventId: 'e4',
    userId: 'u4',
    bookingDate: '2025-04-01T11:00:00Z',
    status: 'Confirmed',
  },
  {
    ticketId: 't11',
    eventId: 'e7',
    userId: 'u2',
    bookingDate: '2025-06-01T09:00:00Z',
    status: 'Confirmed',
  },
];

export const MOCK_FEEDBACK: Feedback[] = [
  {
    feedbackId: 'f1',
    eventId: 'e_past_1',
    userId: 'u2',
    rating: 5,
    comments: 'Mind-blowing technical depth. The keynote on silicon photonics was world-class.',
    submittedTimestamp: '2024-02-16T10:00:00Z',
  },
  {
    feedbackId: 'f2',
    eventId: 'e_past_1',
    userId: 'u3',
    rating: 4,
    comments: 'Great content, but the venue was a bit cold.',
    submittedTimestamp: '2024-02-17T09:30:00Z',
  },
  {
    feedbackId: 'f3',
    eventId: 'e_past_1',
    userId: 'u4',
    rating: 5,
    comments: 'A must-attend for anyone in the hardware space.',
    submittedTimestamp: '2024-02-16T15:00:00Z',
  },
  {
    feedbackId: 'f4',
    eventId: 'e_past_1',
    userId: 'u5',
    rating: 3,
    comments: 'Too technical for me, I was expecting more consumer tech showcases.',
    submittedTimestamp: '2024-02-18T11:00:00Z',
  },

  {
    feedbackId: 'f5',
    eventId: 'e_past_2',
    userId: 'u2',
    rating: 5,
    comments: 'The second film brought me to tears. Beautiful curation.',
    submittedTimestamp: '2024-03-11T09:00:00Z',
  },
  {
    feedbackId: 'f6',
    eventId: 'e_past_2',
    userId: 'u5',
    rating: 2,
    comments: 'The Q&A session was too short and the audio was terrible.',
    submittedTimestamp: '2024-03-11T10:30:00Z',
  },
  {
    feedbackId: 'f7',
    eventId: 'e_past_2',
    userId: 'u6',
    rating: 4,
    comments: 'Great selection of indie movies. Popcorn was expensive though!',
    submittedTimestamp: '2024-03-12T14:00:00Z',
  },
  {
    feedbackId: 'f8',
    eventId: 'e_past_2',
    userId: 'u7',
    rating: 5,
    comments: 'An artistic masterpiece of an evening.',
    submittedTimestamp: '2024-03-11T22:00:00Z',
  },
  {
    feedbackId: 'f9',
    eventId: 'e_past_2',
    userId: 'u8',
    rating: 4,
    comments: 'Solid lineup. Loved the director from France.',
    submittedTimestamp: '2024-03-13T09:00:00Z',
  },
  {
    feedbackId: 'f10',
    eventId: 'e_past_2',
    userId: 'u3',
    rating: 3,
    comments: 'Films were okay, but the seating was uncomfortable.',
    submittedTimestamp: '2024-03-12T11:00:00Z',
  },
];
