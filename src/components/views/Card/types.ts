export interface ICardCatalogCallbacks {
  onSelect: (id: string) => void;
}

export interface ICardBasketCallbacks {
  onDelete: (id: string) => void;  // ✅ onDelete!
}

export interface ICardPreviewCallbacks {
  onClick: () => void;
}

