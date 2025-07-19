

export type Property = {
  id: string;
  title: string;
  type: string;
  location: string;
  status: 'Published' | 'Pending Review' | 'Disabled';
  coords: {
    lat: number;
    lng: number;
  };
  pricePerNight: number;
  rating: number;
  reviewsCount: number;
  maxGuests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  description: string;
  host: Host;
  amenities: string[];
  images: string[];
  rules: string[];
  availability: string[]; // Ideally dates, but string for mock
  reviews: Review[];
  distance?: number;
};

export type Host = {
  id: string;
  name: string;
  avatar: string;
  joinYear: number;
  isSuperhost: boolean;
};

export type Review = {
  id: string;
  bookingId: string; // Link review to a specific booking
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  rating: number;
  comment: string;
};

export type Booking = {
  id: string;
  propertyId: string;
  guest: { name: string; id: string };
  host: { name: string; id: string };
  dates: { from: Date; to: Date };
  amount: number;
  status: 'Confirmed' | 'Cancelled' | 'Completed' | 'Pending Confirmation';
};

export type Message = {
    from: {
        id: string;
        name: string;
        type: 'guest' | 'host' | 'admin';
    };
    text: string;
    time: string;
}

export type Conversation = {
    id: string;
    userIds: string[];
    participant: {
        id: string;
        name: string;
        avatar: string;
    };
    subject?: string;
    messages: Message[];
}

    