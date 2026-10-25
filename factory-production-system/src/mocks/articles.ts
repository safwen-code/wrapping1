import type { Article } from '@/types/article'

export const articles: Article[] = [
  {
    id: 'article-100-90',
    reference: '100.90 NC',
    dirtySide: {
      height: {
        nominal: 376,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
      width: {
        nominal: 201,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
    },
    cleanSide: {
      height: {
        nominal: 376,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
      width: {
        nominal: 210,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
    },
  },
  {
    id: 'article-100-48',
    reference: '100.48 NC',
    dirtySide: {
      height: {
        nominal: 221,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
      width: {
        nominal: 112,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
    },
    cleanSide: {
      height: {
        nominal: 218,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
      width: {
        nominal: 122,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
    },
  },
  {
    id: 'article-100-45',
    reference: '100.45 NC',
    dirtySide: {
      height: {
        nominal: 326,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
      width: {
        nominal: 221,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
    },
    cleanSide: {
      height: {
        nominal: 326,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
      width: {
        nominal: 221,
        tolerancePlus: 1,
        toleranceMinus: 2,
      },
    },
  },
]
