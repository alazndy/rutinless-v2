import { Place, Category } from './types';

export const MOCK_PLACES: Place[] = [
  {
    id: '1',
    name: 'Kronotrop Karaköy',
    category: Category.CAFE,
    description: 'Nitelikli kahve severler için modern ve ferah bir ortam.',
    location: { lat: 41.025, lng: 28.978 },
    rating: 4.8,
    tags: ['Sessiz', 'Çalışmaya Uygun', 'Nitelikli Kahve'],
    imageUrl: 'https://picsum.photos/800/600?random=1',
    priceLevel: 3
  },
  {
    id: '2',
    name: 'Salt Galata',
    category: Category.MUSEUM,
    description: 'Tarihi bina içinde kütüphane, müze ve kafe deneyimi.',
    location: { lat: 41.024, lng: 28.974 },
    rating: 4.9,
    tags: ['Tarihi', 'Kültür', 'Manzara'],
    imageUrl: 'https://picsum.photos/800/600?random=2',
    priceLevel: 1
  },
  {
    id: '3',
    name: 'Moda Sahili',
    category: Category.PARK,
    description: 'Gün batımını izlemek ve çimlerde yayılmak için klasik bir nokta.',
    location: { lat: 40.983, lng: 29.026 },
    rating: 4.7,
    tags: ['Açık Hava', 'Deniz Kenarı', 'Sosyal'],
    imageUrl: 'https://picsum.photos/800/600?random=3',
    priceLevel: 1
  },
  {
    id: '4',
    name: 'Aheste Pera',
    category: Category.RESTAURANT,
    description: 'Modern Türk mutfağı mezeleri ile ünlü şık restoran.',
    location: { lat: 41.031, lng: 28.976 },
    rating: 4.6,
    tags: ['Romantik', 'Gastronomi', 'Akşam Yemeği'],
    imageUrl: 'https://picsum.photos/800/600?random=4',
    priceLevel: 4
  },
  {
    id: '5',
    name: 'Museum of Motivation',
    category: Category.ACTIVITY,
    description: 'İnteraktif sanat eserleriyle dolu, fotoğraf çekmelik bir alan.',
    location: { lat: 41.066, lng: 29.006 },
    rating: 4.2,
    tags: ['Eğlence', 'Fotoğraf', 'Renkli'],
    imageUrl: 'https://picsum.photos/800/600?random=5',
    priceLevel: 3
  },
  {
    id: '6',
    name: 'Petra Roasting Co.',
    category: Category.CAFE,
    description: 'Sanat galerisi içinde yer alan minimalist kahve dükkanı.',
    location: { lat: 41.068, lng: 29.014 },
    rating: 4.7,
    tags: ['Sanat', 'Kahve', 'Modern'],
    imageUrl: 'https://picsum.photos/800/600?random=6',
    priceLevel: 3
  },
  {
    id: '7',
    name: 'Arter',
    category: Category.MUSEUM,
    description: 'Çağdaş sanat sergileri için devasa bir kompleks.',
    location: { lat: 41.040, lng: 28.983 },
    rating: 4.5,
    tags: ['Sanat', 'Sergi', 'Modern Mimari'],
    imageUrl: 'https://picsum.photos/800/600?random=7',
    priceLevel: 2
  },
  {
    id: '8',
    name: 'Maçka Parkı',
    category: Category.PARK,
    description: 'Şehrin ortasında nefes almak ve köpek gezdirmek için ideal.',
    location: { lat: 41.045, lng: 28.993 },
    rating: 4.6,
    tags: ['Doğa', 'Köpek Dostu', 'Piknik'],
    imageUrl: 'https://picsum.photos/800/600?random=8',
    priceLevel: 1
  },
  {
    id: '9',
    name: 'Nardis Jazz Club',
    category: Category.NIGHTLIFE,
    description: 'Canlı caz performansları için şehrin en iyi mekanı.',
    location: { lat: 41.025, lng: 28.974 },
    rating: 4.8,
    tags: ['Müzik', 'Canlı Performans', 'Gece'],
    imageUrl: 'https://picsum.photos/800/600?random=9',
    priceLevel: 3
  },
  {
    id: '10',
    name: 'Türk Alman Kitabevi',
    category: Category.CAFE,
    description: 'Kitap kokusu ve iyi kahvenin buluştuğu İstiklal klasiği.',
    location: { lat: 41.028, lng: 28.973 },
    rating: 4.6,
    tags: ['Kitap', 'Sessiz', 'Tatlı'],
    imageUrl: 'https://picsum.photos/800/600?random=10',
    priceLevel: 2
  }
];

export const INITIAL_USER_STATS = {
  totalVisits: 0,
  favoriteCategory: null,
  characterTitle: 'Şehir Çaylağı',
  characterQuote: 'Henüz yolun başındasın, keşfedecek çok yer var!'
};
