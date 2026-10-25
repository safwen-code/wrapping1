export interface ArticleMeasurement {
  nominal: number
  tolerancePlus: number
  toleranceMinus: number
}

export interface ArticleSide {
  height: ArticleMeasurement | null
  width: ArticleMeasurement | null
}

export interface Article {
  id: string
  reference: string
  dirtySide: ArticleSide
  cleanSide: ArticleSide
}
