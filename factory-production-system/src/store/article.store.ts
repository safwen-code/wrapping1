import { create } from 'zustand'

import { articles } from '@/mocks/articles'
import type { Article } from '@/types/article'

interface ArticleState {
  articles: Article[]
  selectedArticleRef: string
  selectArticle: (reference: string) => void
}

export const useArticleStore = create<ArticleState>((set) => ({
  articles,
  selectedArticleRef: '',

  selectArticle: (reference) => {
    set({ selectedArticleRef: reference })
  },
}))
