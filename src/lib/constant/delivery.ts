export interface DeliveryType {
  $id: string;
  days: number;
  priceCents: number;
}

export const deliveryOptions: DeliveryType[] = [
  {
    $id: "1",
    days: 7,
    priceCents: 0,
  },
  {
    $id: "2",
    days: 4,
    priceCents: 499,
  },
  {
    $id: "3",
    days: 1,
    priceCents: 999,
  },
];
