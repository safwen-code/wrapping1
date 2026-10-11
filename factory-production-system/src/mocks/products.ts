import { Product } from '@/types/product'

export const products: Product[] = [
  {
    id: 'p001',
    number: 'PRD-1001',

    dirtyHeight: 378,
    dirtyWidth: 255,

    cleanHeight: 378,
    cleanWidth: 255,

    big: true,
    small: false,

    status: 'CONFIRMED',

    machineId: '1',
    operatorId: '2',
    operatorName: 'Ahmed',

    createdAt: '2026-10-06T06:15:00',
  },

  {
    id: 'p002',
    number: 'PRD-1002',

    dirtyHeight: 377,
    dirtyWidth: 256,

    cleanHeight: 377,
    cleanWidth: 256,

    big: true,
    small: false,

    status: 'NOT_CONFIRMED',

    machineId: '1',
    operatorId: '2',
    operatorName: 'Ahmed',

    createdAt: '2026-10-06T06:22:00',
  },

  {
    id: 'p003',
    number: 'PRD-1003',

    dirtyHeight: 379,
    dirtyWidth: 254,

    cleanHeight: 379,
    cleanWidth: 254,

    big: false,
    small: true,

    status: 'NOT_CONFIRMED',

    machineId: '1',
    operatorId: '2',
    operatorName: 'Ahmed',

    createdAt: '2026-10-06T06:30:00',
  },

  {
    id: 'p004',
    number: 'PRD-1004',

    dirtyHeight: 378,
    dirtyWidth: 257,

    cleanHeight: 378,
    cleanWidth: 257,

    big: false,
    small: false,

    status: 'CONFIRMED',

    machineId: '1',
    operatorId: '2',
    operatorName: 'Ahmed',

    createdAt: '2026-10-06T06:45:00',
  },
]
