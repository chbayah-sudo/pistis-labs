export interface JourneyStop {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
  story: string;
  economicImpact?: string;
  personName?: string;
  personQuote?: string;
  duration?: string;
}

export interface Journey {
  product: string;
  productCategory: string;
  description: string;
  imageUrl: string;
  stops: JourneyStop[];
  map: {
    startLocation: {
      lat: number;
      lng: number;
      name: string;
    };
    endLocation: {
      lat: number;
      lng: number;
      name: string;
    };
  };
  totalDistance?: string;
  musicUrl?: string;
  narrative: string;
}
