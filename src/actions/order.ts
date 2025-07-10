"use server";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../lib/server/appwrite";
import { appwrite } from "../lib/server/appwriteKeys";
import { clearCart, getCart } from "./cart";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Product } from "./products";
import { currentUser } from "@clerk/nextjs/server";

export type OrderItem = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  product: Product;
  quantity: number;
  estimatedDeliveryTime: Date;
};

export type orderType = {
  userId: string;
  totalCostCents: number;
  orderTime: Date;
  orderItems: string[];
  productDetail?: OrderItem[];
};

export type OrderMetadata = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
};

export async function placeOrder() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { databases } = await createAdminClient();
  const cartItems = await getCart();

  const orders: orderType = {
    userId: user.id,
    totalCostCents: 0,
    orderTime: new Date(),
    orderItems: [],
  };

  try {
    // Calculate total cost first
    let totalCost = 0;
    cartItems.forEach((cart) => {
      totalCost += cart.product_detail.priceCents * cart.quantity;
    });
    orders.totalCostCents = totalCost;

    // Process each cart item sequentially
    for (const cart of cartItems) {
      const doc = await databases.createDocument(
        appwrite.databaseId,
        appwrite.orderItemCollectionId,
        ID.unique(),
        {
          product: cart.product_detail.$id,
          quantity: cart.quantity,
          estimatedDeliveryTime: new Date(
            Date.now() + cart.shippingOption.days * 24 * 60 * 60 * 1000
          ),
        }
      );
      orders.orderItems.push(doc.$id);
    }

    // Create the main order document
    await databases.createDocument(
      appwrite.databaseId,
      appwrite.orderCollectionId,
      ID.unique(),
      orders
    );

    // Clear the cart after successful order
    await clearCart(user.id);

    revalidatePath("/orders");
    redirect("/orders");
  } catch (error) {
    console.error("Error placing order:", error);
    throw error;
  }
}

export async function allOrdersBatch() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { databases } = await createAdminClient();
  const { documents: orders } = await databases.listDocuments<
    orderType & OrderMetadata
  >(appwrite.databaseId, appwrite.orderCollectionId, [
    Query.equal("userId", user.id),
  ]);

  // Collect all unique order item IDs
  const allOrderItemIds = [
    ...new Set(orders.flatMap((order) => order.orderItems)),
  ];

  // If no order items, return orders with empty productDetail
  if (allOrderItemIds.length === 0) {
    for (const order of orders) {
      order.productDetail = [];
    }
    return orders;
  }

  // Fetch all order items in batches (Appwrite has query limits)
  const allOrderItems = [];
  const batchSize = 100; // Adjust based on Appwrite's limits

  for (let i = 0; i < allOrderItemIds.length; i += batchSize) {
    const batch = allOrderItemIds.slice(i, i + batchSize);

    if (batch.length === 1) {
      // Single item - use regular equal query
      const { documents } = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.orderItemCollectionId,
        [Query.equal("$id", batch[0])]
      );
      allOrderItems.push(...documents);
    } else {
      // Multiple items - use OR query
      const queries = batch.map((id) => Query.equal("$id", id));
      const orQuery = Query.or(queries);

      const { documents } = await databases.listDocuments(
        appwrite.databaseId,
        appwrite.orderItemCollectionId,
        [orQuery]
      );
      allOrderItems.push(...(documents as OrderItem[]));
    }
  }

  // Create a map for quick lookup
  const orderItemMap = new Map<string, OrderItem>(
    allOrderItems
      .filter(
        (item): item is OrderItem =>
          typeof item === "object" &&
          "product" in item &&
          "quantity" in item &&
          "estimatedDeliveryTime" in item
      )
      .map((item) => [item.$id, item])
  );

  // Populate orders with their items
  for (const order of orders) {
    order.productDetail = order.orderItems
      .map((id) => orderItemMap.get(id))
      .filter((item): item is OrderItem => item !== undefined);
  }

  return orders;
}

export async function getOrderDetail(orderId: string, orderitemid: string) {
  const { databases } = await createAdminClient();
  const { documents: orderDetail } = await databases.listDocuments<
    OrderMetadata & orderType
  >(appwrite.databaseId, appwrite.orderCollectionId, [
    Query.equal("$id", orderId),
    Query.limit(1),
  ]);

  const { documents: orderItemDetail } =
    await databases.listDocuments<OrderItem>(
      appwrite.databaseId,
      appwrite.orderItemCollectionId,
      [Query.equal("$id", orderitemid), Query.limit(1)]
    );

  const trackingOrderDetail = {
    id: orderDetail[0].$id,
    orderTime: orderDetail[0].orderTime,
    Product: orderItemDetail[0].product,
    quantity: orderItemDetail[0].quantity,
    estimatedDeliveryTime: orderItemDetail[0].estimatedDeliveryTime,
  };
  return trackingOrderDetail;
}
