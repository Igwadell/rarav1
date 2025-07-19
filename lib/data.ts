

import type { Property, Review, Host, Booking, Conversation, Message } from './types';

// prettier-ignore
export const amenityOptions = ['Wifi', 'Kitchen', 'Air conditioning', 'Free parking', 'TV', 'Washer', 'Dedicated workspace', 'Indoor fireplace', 'Hot tub', 'BBQ grill', 'Pool', 'Breakfast', 'Elevator', 'Beach access', 'Lake access', 'Pocket wifi'];

const getInitialProperties = (): Property[] => [
  {
    id: '1',
    title: 'Sunny Loft in the Heart of the City',
    type: 'Entire loft',
    status: 'Published',
    location: 'New York, USA',
    coords: { lat: 40.7128, lng: -74.0060 },
    pricePerNight: 325000,
    rating: 4.9,
    reviewsCount: 120,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description:
      'Experience the best of the city from this bright and stylish loft. With stunning views, modern amenities, and a central location, it\'s the perfect base for your urban adventure. The open-plan living space is perfect for relaxing after a day of exploring.',
    host: {
      id: 'H001',
      name: 'Sarah',
      avatar: 'https://i.pravatar.cc/100?u=H001',
      joinYear: 2018,
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'TV', 'Washer', 'Dedicated workspace'],
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560185007-c5ca9d2c015d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=1974&auto=format&fit=crop',
    ],
    rules: ['No smoking', 'No pets', 'No parties or events'],
    availability: [],
    reviews: [
      {
        id: 'r1',
        bookingId: 'BK001',
        author: { name: 'John', avatar: 'https://i.pravatar.cc/50?u=U001' },
        date: 'October 2023',
        rating: 5,
        comment: 'Amazing place! The location is unbeatable and the loft is beautiful. Sarah was a fantastic host.',
      },
       {
        id: 'r1a',
        bookingId: 'BK_prev1',
        author: { name: 'Maria', avatar: 'https://i.pravatar.cc/50?u=maria' },
        date: 'September 2023',
        rating: 5,
        comment: 'Could not have asked for a better stay. The apartment is clean, modern, and in the heart of everything. Will be back!',
      },
    ],
  },
  {
    id: '2',
    title: 'Cozy Cabin Retreat in the Woods',
    type: 'Entire cabin',
    status: 'Published',
    location: 'Asheville, USA',
    coords: { lat: 35.5951, lng: -82.5515 },
    pricePerNight: 234000,
    rating: 4.98,
    reviewsCount: 250,
    maxGuests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1,
    description:
      'Escape to this charming cabin nestled in the forest. Enjoy the peace and quiet of nature, cozy up by the fireplace, or explore the nearby hiking trails. A perfect getaway for couples or small families.',
    host: {
      id: 'H002',
      name: 'Mike & Amy',
      avatar: 'https://i.pravatar.cc/100?u=H002',
      joinYear: 2016,
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Heating', 'Indoor fireplace', 'Hot tub', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1506974210756-8e1b8985d348?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631049552057-403d6b62f820?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2158&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1605346436446-15e5c6ca8b6f?q=80&w=1974&auto=format&fit=crop',
    ],
    rules: ['No smoking', 'Pets allowed', 'Quiet hours after 10 PM'],
    availability: [],
    reviews: [
      {
        id: 'r2',
        bookingId: 'BK_prev2',
        author: { name: 'Lisa', avatar: 'https://i.pravatar.cc/50?u=lisa' },
        date: 'September 2023',
        rating: 5,
        comment: 'This cabin is a dream. So peaceful and well-equipped. The hot tub was a highlight!',
      },
       {
        id: 'r2a',
        bookingId: 'BK_prev3',
        author: { name: 'Kevin', avatar: 'https://i.pravatar.cc/50?u=kevin' },
        date: 'August 2023',
        rating: 5,
        comment: 'Absolutely perfect getaway. The cabin is rustic but has all the modern comforts. We loved our stay.',
      },
    ],
  },
  {
    id: '3',
    title: 'Modern Beach House with Ocean View',
    type: 'Entire house',
    status: 'Published',
    location: 'Malibu, USA',
    coords: { lat: 34.0259, lng: -118.7798 },
    pricePerNight: 715000,
    rating: 4.85,
    reviewsCount: 85,
    maxGuests: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 3,
    description:
      'Wake up to the sound of waves in this stunning modern beach house. With direct beach access and panoramic ocean views from every room, this is the ultimate coastal escape. The spacious deck is perfect for sunbathing and al fresco dining.',
    host: {
      id: 'H003',
      name: 'David',
      avatar: 'https://i.pravatar.cc/100?u=H003',
      joinYear: 2020,
      isSuperhost: false,
    },
    amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'Beach access', 'BBQ grill', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
    ],
    rules: ['No smoking', 'No pets', 'No large gatherings'],
    availability: [],
    reviews: [
      {
        id: 'r3',
        bookingId: 'BK003',
        author: { name: 'Jessica', avatar: 'https://i.pravatar.cc/50?u=jessica' },
        date: 'August 2023',
        rating: 5,
        comment: 'Incredible house with breathtaking views. We had the most relaxing vacation. Highly recommend!',
      },
      {
        id: 'r3a',
        bookingId: 'BK_prev4',
        author: { name: 'Robert', avatar: 'https://i.pravatar.cc/50?u=robert' },
        date: 'July 2023',
        rating: 4,
        comment: 'The location is amazing. The house is a bit worn but you can\'t beat the view and beach access.',
      },
    ],
  },
  {
    id: '4',
    title: 'Chic Parisian Apartment near Eiffel Tower',
    type: 'Entire apartment',
    status: 'Published',
    location: 'Paris, France',
    coords: { lat: 48.8566, lng: 2.3522 },
    pricePerNight: 416000,
    rating: 4.92,
    reviewsCount: 150,
    maxGuests: 3,
    bedrooms: 1,
    beds: 2,
    bathrooms: 1,
    description:
      'Live like a Parisian in this elegant and stylish apartment. Located in a classic Haussmann building, you are just a short walk from the Eiffel Tower. The apartment features high ceilings, beautiful decor, and a charming balcony.',
    host: {
      id: 'H004',
      name: 'Chloé',
      avatar: 'https://i.pravatar.cc/100?u=H004',
      joinYear: 2017,
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Heating', 'TV', 'Elevator', 'Washer'],
    images: [
        "https://images.unsplash.com/photo-1502602898657-3e91760c0341?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1549638441-b78759e1c14b?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505691938895-1758d7FEB511?q=80&w=2070&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1560184897-ae75f418493e?q=80&w=2070&auto=format&fit=crop"
    ],
    rules: ['No smoking', 'No pets'],
    availability: [],
    reviews: [
      {
        id: 'r4',
        bookingId: 'BK_prev5',
        author: { name: 'Emily', avatar: 'https://i.pravatar.cc/50?u=emily' },
        date: 'November 2023',
        rating: 5,
        comment: 'The apartment was perfect for our trip to Paris. It was clean, comfortable, and in an amazing location.',
      },
       {
        id: 'r4a',
        bookingId: 'BK_prev6',
        author: { name: 'Daniel', avatar: 'https://i.pravatar.cc/50?u=daniel' },
        date: 'October 2023',
        rating: 5,
        comment: 'A truly magical place. The balcony was our favorite spot. Chloé was an excellent host.',
      },
    ],
  },
  {
    id: '5',
    title: 'Historic Townhouse in Rome',
    type: 'Private room in townhouse',
    status: 'Published',
    location: 'Rome, Italy',
    coords: { lat: 41.9028, lng: 12.4964 },
    pricePerNight: 156000,
    rating: 4.75,
    reviewsCount: 210,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description:
      'Stay in a beautiful private room in a historic townhouse in the charming Trastevere neighborhood. You will have your own space while also enjoying the authentic Roman lifestyle. The host is a local artist with great tips for exploring the city.',
    host: {
      id: 'H005',
      name: 'Marco',
      avatar: 'https://i.pravatar.cc/100?u=H005',
      joinYear: 2015,
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Air conditioning', 'Breakfast', 'Dedicated workspace'],
    images: [
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2057&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1566647387313-9fda801a6988?q=80&w=1974&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1594924849154-a951583d7396?q=80&w=2070&auto=format&fit=crop'
    ],
    rules: ['No smoking', 'No guests'],
    availability: [],
    reviews: [
      {
        id: 'r5',
        bookingId: 'BK_prev7',
        author: { name: 'Ben', avatar: 'https://i.pravatar.cc/50?u=ben' },
        date: 'October 2023',
        rating: 4.5,
        comment: 'Great location and Marco was a wonderful host. The room was a bit smaller than expected but very clean.',
      },
      {
        id: 'r5a',
        bookingId: 'BK_prev8',
        author: { name: 'Olivia', avatar: 'https://i.pravatar.cc/50?u=olivia' },
        date: 'September 2023',
        rating: 5,
        comment: 'Trastevere is the best neighborhood in Rome, and this townhouse is the perfect place to stay. I loved it.',
      },
    ],
  },
  {
    id: '6',
    title: 'Villa with Private Pool in Bali',
    type: 'Entire villa',
    status: 'Published',
    location: 'Ubud, Indonesia',
    coords: { lat: -8.5068, lng: 115.2625 },
    pricePerNight: 520000,
    rating: 4.99,
    reviewsCount: 180,
    maxGuests: 8,
    bedrooms: 4,
    beds: 4,
    bathrooms: 4,
    description:
      'Experience paradise in this luxurious villa surrounded by lush rice paddies. With a private infinity pool, open-air living spaces, and a dedicated staff, this is the perfect place to unwind and reconnect with nature. Daily breakfast is included.',
    host: {
      id: 'H006',
      name: 'Wayan',
      avatar: 'https://i.pravatar.cc/100?u=H006',
      joinYear: 2019,
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Pool', 'Air conditioning', 'Breakfast', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1597321882333-5b14e6b54f9a?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598539225212-32d561df4042?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1596203923324-b153915d32b8?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574510106821-1b893f411634?q=80&w=2070&auto=format&fit=crop',
    ],
    rules: ['No smoking', 'No parties'],
    availability: [],
    reviews: [
      {
        id: 'r6',
        bookingId: 'BK_prev9',
        author: { name: 'Sophie', avatar: 'https://i.pravatar.cc/50?u=sophie' },
        date: 'July 2023',
        rating: 5,
        comment: 'The most incredible place I have ever stayed. The villa is stunning and the staff are so kind and helpful.',
      },
      {
        id: 'r6a',
        bookingId: 'BK_prev10',
        author: { name: 'Chris', avatar: 'https://i.pravatar.cc/50?u=chris' },
        date: 'June 2023',
        rating: 5,
        comment: 'This is pure luxury. If you\'re thinking about booking it, just do it. You won\'t regret it.',
      },
    ],
  },
  {
    id: '7',
    title: 'Minimalist Apartment in Tokyo',
    type: 'Entire apartment',
    status: 'Published',
    location: 'Shibuya, Japan',
    coords: { lat: 35.662, lng: 139.704 },
    pricePerNight: 273000,
    rating: 4.88,
    reviewsCount: 95,
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    description:
      'A serene and minimalist apartment in the heart of bustling Shibuya. This clean and modern space is a perfect retreat from the city\'s energy. Just minutes away from the famous Shibuya Crossing, endless shopping, and dining.',
    host: {
      id: 'H007',
      name: 'Kenji',
      avatar: 'https://i.pravatar.cc/100?u=H007',
      joinYear: 2018,
      isSuperhost: false,
    },
    amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'Washer', 'Pocket wifi'],
    images: [
      'https://images.unsplash.com/photo-1591560933167-542a35515c12?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617098900599-919794216ae7?q=80&w=1974&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631700211136-1a0a574b830e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1628592102751-ba834f691653?q=80&w=2106&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1631679074338-24c481d44b93?q=80&w=2070&auto=format&fit=crop',
    ],
    rules: ['No smoking', 'No shoes inside'],
    availability: [],
    reviews: [
      {
        id: 'r7',
        bookingId: 'BK_prev11',
        author: { name: 'Alex', avatar: 'https://i.pravatar.cc/50?u=alex' },
        date: 'November 2023',
        rating: 5,
        comment: 'Kenji\'s apartment is perfect. It is impeccably clean, and the location is amazing. The pocket wifi was a lifesaver!',
      },
      {
        id: 'r7a',
        bookingId: 'BK_prev12',
        author: { name: 'Grace', avatar: 'https://i.pravatar.cc/50?u=grace' },
        date: 'October 2023',
        rating: 4.8,
        comment: 'Small but very functional and stylish. Great base for exploring Tokyo. Can be a bit noisy at night but that\'s expected in Shibuya.',
      },
    ],
  },
  {
    id: '8',
    title: 'Lakeside House with Stunning Views',
    type: 'Entire house',
    status: 'Published',
    location: 'Queenstown, New Zealand',
    coords: { lat: -45.0312, lng: 168.6626 },
    pricePerNight: 455000,
    rating: 4.95,
    reviewsCount: 130,
    maxGuests: 5,
    bedrooms: 3,
    beds: 3,
    bathrooms: 2,
    description:
      'This beautiful house on the shores of Lake Wakatipu offers breathtaking views of the Remarkables mountain range. The perfect spot for adventure seekers or those looking to relax and take in the scenery. Close to ski fields and hiking trails.',
    host: {
      id: 'H008',
      name: 'Fiona',
      avatar: 'https://i.pravatar.cc/100?u=H008',
      joinYear: 2017,
      isSuperhost: true,
    },
    amenities: ['Wifi', 'Kitchen', 'Heating', 'Indoor fireplace', 'Lake access', 'Free parking'],
    images: [
      'https://images.unsplash.com/photo-1544453857-89798a6b18c7?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595184221151-0e6093a400a4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594924849154-a951583d7396?q=80&w=2070&auto=format&fit=crop',
    ],
    rules: ['No smoking', 'No pets'],
    availability: [],
    reviews: [
      {
        id: 'r8',
        bookingId: 'BK_prev13',
        author: { name: 'Tom', avatar: 'https://i.pravatar.cc/50?u=tom' },
        date: 'August 2023',
        rating: 5,
        comment: 'The views from this house are simply spectacular. We had an amazing time and Fiona was a great host. Would love to come back.',
      },
      {
        id: 'r8a',
        bookingId: 'BK_prev14',
        author: { name: 'Rachel', avatar: 'https://i.pravatar.cc/50?u=rachel' },
        date: 'July 2023',
        rating: 5,
        comment: 'Waking up to that view every morning was unforgettable. The house is spacious and comfortable.',
      },
    ],
  },
];

const getInitialBookings = (): Booking[] => [
  { 
    id: 'BK001', 
    propertyId: '1',
    guest: { name: 'John Doe', id: 'U001' },
    host: { name: 'Sarah', id: 'H001' },
    dates: { from: new Date('2024-10-15'), to: new Date('2024-10-20') },
    amount: 1625000,
    status: 'Completed' 
  },
  { 
    id: 'BK002', 
    propertyId: '2',
    guest: { name: 'Jane Smith', id: 'U002' },
    host: { name: 'Mike & Amy', id: 'H002' },
    dates: { from: new Date('2024-11-01'), to: new Date('2024-11-05') },
    amount: 936000,
    status: 'Confirmed' 
  },
  { 
    id: 'BK003', 
    propertyId: '3',
    guest: { name: 'Mike Brown', id: 'U003' },
    host: { name: 'David', id: 'H003' },
    dates: { from: new Date('2024-09-20'), to: new Date('2024-09-25') },
    amount: 3575000,
    status: 'Cancelled' 
  },
   { 
    id: 'BK004', 
    propertyId: '1',
    guest: { name: 'John Doe', id: 'U001' },
    host: { name: 'Sarah', id: 'H001' },
    dates: { from: new Date('2024-08-15'), to: new Date('2024-08-20') },
    amount: 1625000,
    status: 'Completed' 
  },
   {
    id: 'BK005',
    propertyId: '1',
    guest: { id: 'U002', name: 'Jane Smith' },
    host: { id: 'H001', name: 'Sarah' },
    dates: { from: new Date('2023-12-10'), to: new Date('2023-12-15') },
    amount: 1787500,
    status: 'Completed'
  },
];

const getInitialConversations = (): Conversation[] => [
    {
        id: 'C001',
        userIds: ['U001', 'H001'],
        participant: { id: 'H001', name: 'Sarah', avatar: 'https://i.pravatar.cc/40?u=H001' },
        subject: 'Sunny Loft in the Heart of the City',
        messages: [
            { from: { id: 'U001', name: 'John Doe', type: 'guest' }, text: 'Hi Sarah, looking forward to my stay!', time: '10:45 AM' },
            { from: { id: 'H001', name: 'Sarah', type: 'host' }, text: 'Hi John! We are excited to have you.', time: '10:47 AM' },
        ]
    },
    {
        id: 'C002',
        userIds: ['U001', 'admin'],
        participant: { id: 'admin', name: 'Help Center', avatar: 'https://i.pravatar.cc/40?u=admin_support' },
        subject: 'Billing Question',
        messages: [
            { from: { id: 'U001', name: 'John Doe', type: 'guest' }, text: 'Hi, I think I was double charged.', time: 'Yesterday' },
            { from: { id: 'admin', name: 'Help Center', type: 'admin' }, text: 'Hello John, I will look into that for you right away.', time: 'Yesterday' },
        ]
    },
    {
      id: 'C003',
      userIds: ['H001', 'U002'],
      participant: { id: 'U002', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/40?u=U002'},
      subject: 'Regarding: Sunny Loft',
      messages: [
          { from: { id: 'U002', name: 'Jane Smith', type: 'guest' }, text: 'Hello! My flight arrives early on the 15th. Is early check-in possible for the Sunny Loft?', time: 'Yesterday' },
      ]
    },
];


class PropertyService {
  private static instance: PropertyService;
  private properties: Property[];

  private constructor() {
    this.properties = getInitialProperties();
  }

  public static getInstance(): PropertyService {
    if (!PropertyService.instance) {
      PropertyService.instance = new PropertyService();
    }
    return PropertyService.instance;
  }

  public getProperties(): Property[] {
    return this.properties;
  }
  
  public getPropertyById(id: string): Property | undefined {
    return this.properties.find(p => p.id === id);
  }

  public getPropertiesByHostId(hostId: string): Property[] {
    return this.properties.filter(p => p.host.id === hostId);
  }

  public addProperty(propertyData: Omit<Property, 'id' | 'status'>): Property {
    const newProperty: Property = {
      ...propertyData,
      id: `P${String(this.properties.length + 1).padStart(3, '0')}`,
      status: 'Pending Review',
    };
    this.properties.unshift(newProperty); // Add to the beginning of the array
    return newProperty;
  }
  
  public updatePropertyStatus(id: string, status: 'Published' | 'Disabled') {
      const propIndex = this.properties.findIndex(p => p.id === id);
      if (propIndex !== -1) {
          this.properties[propIndex].status = status;
      }
  }

  public addReview(propertyId: string, reviewData: Omit<Review, 'id'| 'date' | 'author'>) {
    const propIndex = this.properties.findIndex(p => p.id === propertyId);
    if (propIndex !== -1) {
        const newReview: Review = {
            ...reviewData,
            id: `r_${propertyId}_${this.properties[propIndex].reviews.length + 1}`,
            date: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric'}),
            author: { // Mocking the author for now
                name: 'John Doe',
                avatar: 'https://i.pravatar.cc/50?u=U001'
            }
        };

        const property = this.properties[propIndex];
        property.reviews.unshift(newReview);
        
        // Recalculate average rating
        const totalRating = property.reviews.reduce((acc, r) => acc + r.rating, 0);
        property.rating = totalRating / property.reviews.length;
        property.reviewsCount = property.reviews.length;
    }
  }
}

class BookingService {
  private static instance: BookingService;
  private bookings: Booking[];

  private constructor() {
    this.bookings = getInitialBookings();
  }

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  public getBookings(): Booking[] {
    return this.bookings;
  }

  public getBookingsByGuestId(guestId: string): Booking[] {
    return this.bookings.filter(b => b.guest.id === guestId);
  }
  
  public getBookingsByHostId(hostId: string): Booking[] {
    return this.bookings.filter(b => b.host.id === hostId);
  }

  public addBooking(booking: Omit<Booking, 'id'>): Booking {
    const newBooking: Booking = {
      ...booking,
      id: `BK${String(this.bookings.length + 1).padStart(3, '0')}`,
    };
    this.bookings.push(newBooking);
    return newBooking;
  }
  
  public updateBookingStatus(id: string, status: 'Confirmed' | 'Cancelled' | 'Completed' | 'Pending Confirmation') {
      const bookingIndex = this.bookings.findIndex(b => b.id === id);
      if (bookingIndex !== -1) {
          this.bookings[bookingIndex].status = status;
      }
  }
}

class MessageService {
  private static instance: MessageService;
  private conversations: Conversation[];

  private constructor() {
    this.conversations = getInitialConversations();
  }

  public static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  public getConversationsForUser(userId: string): Conversation[] {
    const userConversations = this.conversations
      .filter(c => c.userIds.includes(userId))
      .map(convo => {
          // Determine the 'other' participant
          const otherUserId = convo.userIds.find(id => id !== userId);
          let participant: Conversation['participant'];

          if (otherUserId === 'admin') {
              participant = { id: 'admin', name: 'Help Center', avatar: 'https://i.pravatar.cc/40?u=admin_support' };
          } else {
              // This part assumes we can find the user/host details. 
              // In a real app, you'd fetch user details from a user service.
              // For mock data, we'll have to find them in our initial data.
              const allUsers = [
                  { id: 'U001', name: 'John Doe', avatar: 'https://i.pravatar.cc/40?u=U001' },
                  { id: 'U002', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/40?u=U002' },
                  { id: 'H001', name: 'Sarah', avatar: 'https://i.pravatar.cc/40?u=H001' },
                  { id: 'H002', name: 'Mike & Amy', avatar: 'https://i.pravatar.cc/40?u=H002' },
              ];
              const otherUser = allUsers.find(u => u.id === otherUserId);
              participant = otherUser ? { ...otherUser } : { id: 'unknown', name: 'Unknown User', avatar: '' };
          }
          
          return { ...convo, participant };
      });
      
    // A bit of a hack to get the host's name for the guest view
    const host = propertyService.getProperties()[0].host;
    userConversations.forEach(convo => {
      if (convo.participant.id === host.id) {
        convo.participant.name = host.name;
        convo.participant.avatar = host.avatar;
      }
    });

    return userConversations;
  }
  
  public addMessage(data: { conversationId: string, from: Message['from'], text: string }) {
    const convoIndex = this.conversations.findIndex(c => c.id === data.conversationId);
    if (convoIndex !== -1) {
        const newMessage: Message = {
            from: data.from,
            text: data.text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        this.conversations[convoIndex].messages.push(newMessage);
    }
  }
}

export const propertyService = PropertyService.getInstance();
export const bookingService = BookingService.getInstance();
export const messageService = MessageService.getInstance();

    
