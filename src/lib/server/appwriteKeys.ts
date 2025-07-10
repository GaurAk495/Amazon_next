export const appwrite = {
  adminKey: process.env.NEXT_APPWRITE_KEY as string,
  endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT as string,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DB_KEY as string,
  productCollectionId: process.env
    .NEXT_PUBLIC_APPWRITE_PRODUCTS_COLLECTION as string,
  deliveryCollectionId: process.env
    .NEXT_PUBLIC_APPWRITE_DELIVERY_COLLECITON as string,
  cartCollectionId: process.env.NEXT_PUBLIC_APPWRITE_CART_COLLECITON as string,
  orderCollectionId: process.env
    .NEXT_PUBLIC_APPWRITE_ORDER_COLLECITON as string,
  orderItemCollectionId: process.env
    .NEXT_PUBLIC_APPWRITE_ORDER_ITEMS_COLLECITON as string,
};
