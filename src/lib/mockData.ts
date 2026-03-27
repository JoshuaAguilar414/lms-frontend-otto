import type { RelatedCourse, TrainingItem } from '@/types';

export const isMockModeEnabled = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

export interface MockOrderItem {
  id: string;
  orderId: string;
  title: string;
  courseType: string;
  date: string;
  orderUrl?: string;
}

export interface MockPurchaseItem {
  id: string;
  productId: string;
  title: string;
  thumbnail: string;
  author: string;
  status: string;
  cost: number;
  currencyCode: string;
  productUrl?: string;
}

interface MockCourse {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  handle: string;
  scormUrl: string;
  totalLessons: number;
}

const mockBaseUrl = 'https://www.ottogroup.com';

export const mockTrainings: TrainingItem[] = [
  {
    id: 'course-otto-esg',
    title: 'ESG Essentials for Teams',
    progress: '3/10',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
    action: 'resume',
    scormUrl: '/scorm/index.html',
  },
  {
    id: 'course-otto-compliance',
    title: 'Compliance Fundamentals',
    progress: '0/8',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    action: 'get_started',
    scormUrl: '/scorm/index.html',
  },
  {
    id: 'course-otto-supply-chain',
    title: 'Sustainable Supply Chain Basics',
    progress: '12/12',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop',
    action: 'view_certificate',
    scormUrl: '/scorm/index.html',
  },
];

export const mockOrders: MockOrderItem[] = [
  {
    id: 'order-1001',
    orderId: '#1001',
    title: 'ESG Essentials for Teams',
    courseType: 'Learning',
    date: '18/03/2026',
    orderUrl: `${mockBaseUrl}/account/orders/1001`,
  },
  {
    id: 'order-1002',
    orderId: '#1002',
    title: 'Compliance Fundamentals',
    courseType: 'Learning',
    date: '21/03/2026',
    orderUrl: `${mockBaseUrl}/account/orders/1002`,
  },
  {
    id: 'order-1003',
    orderId: '#1003',
    title: 'Sustainable Supply Chain Basics',
    courseType: 'Learning',
    date: '25/03/2026',
    orderUrl: `${mockBaseUrl}/account/orders/1003`,
  },
];

export const mockPurchases: MockPurchaseItem[] = [
  {
    id: 'purchase-1',
    productId: 'course-otto-esg',
    title: 'ESG Essentials for Teams',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=112&h=112&fit=crop',
    author: 'Otto Group',
    status: 'In progress',
    cost: 49.9,
    currencyCode: 'EUR',
    productUrl: `${mockBaseUrl}/products/esg-essentials-for-teams`,
  },
  {
    id: 'purchase-2',
    productId: 'course-otto-compliance',
    title: 'Compliance Fundamentals',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=112&h=112&fit=crop',
    author: 'Otto Group',
    status: 'In progress',
    cost: 79,
    currencyCode: 'EUR',
    productUrl: `${mockBaseUrl}/products/compliance-fundamentals`,
  },
  {
    id: 'purchase-3',
    productId: 'course-otto-supply-chain',
    title: 'Sustainable Supply Chain Basics',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=112&h=112&fit=crop',
    author: 'Otto Group',
    status: 'Complete',
    cost: 99,
    currencyCode: 'EUR',
    productUrl: `${mockBaseUrl}/products/sustainable-supply-chain-basics`,
  },
];

export const mockCourseCatalog: MockCourse[] = [
  {
    _id: 'course-otto-esg',
    title: 'ESG Essentials for Teams',
    description: 'Understand ESG fundamentals and apply practical actions across daily operations.',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop',
    handle: 'esg-essentials-for-teams',
    scormUrl: '/scorm/index.html',
    totalLessons: 10,
  },
  {
    _id: 'course-otto-compliance',
    title: 'Compliance Fundamentals',
    description: 'Build confidence with compliance basics, anti-corruption, and data protection principles.',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
    handle: 'compliance-fundamentals',
    scormUrl: '/scorm/index.html',
    totalLessons: 8,
  },
  {
    _id: 'course-otto-supply-chain',
    title: 'Sustainable Supply Chain Basics',
    description: 'Learn supplier due diligence, reporting, and sustainable sourcing best practices.',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop',
    handle: 'sustainable-supply-chain-basics',
    scormUrl: '/scorm/index.html',
    totalLessons: 12,
  },
];

export const mockRelatedCourses: RelatedCourse[] = mockCourseCatalog.map((course) => ({
  id: course._id,
  title: course.title,
  description: course.description,
  thumbnail: course.thumbnail,
  tag: 'Course',
  price: '',
  href: `${mockBaseUrl}/products/${course.handle}`,
}));
