import { User } from '@/types/auth'

export const users: User[] = [
  {
    id: '1',
    operatorCode: 'admin',
    password: '123456',
    name: 'Administrator',
    role: 'ADMIN',
  },
  {
    id: '2',
    operatorCode: 'op001',
    password: '123456',
    name: 'Ahmed',
    role: 'OPERATOR',
  },
  {
    id: '3',
    operatorCode: 'op002',
    password: '123456',
    name: 'Ali',
    role: 'OPERATOR',
  },
  {
    id: '4',
    operatorCode: 'op003',
    password: '123456',
    name: 'Mahdi',
    role: 'OPERATOR',
  },
]
