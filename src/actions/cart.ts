"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../lib/server/appwrite";
import { appwrite } from "../lib/server/appwriteKeys";
import { revalidatePath } from "next/cache";
import { Product } from "./products";
import { DeliveryType } from "../lib/constant/delivery";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function addToCart(productId: string, formdata: FormData) {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const qty = Number(formdata.get("quantity")) || 1;

  const { databases } = await createAdminClient();

  // Check if product already exists in cart
  const existing = await databases.listDocuments(
    appwrite.databaseId,
    appwrite.cartCollectionId,
    [Query.equal("product_id", productId)]
  );

  if (existing.total > 0) {
    const cartItem = existing.documents[0];
    const updatedQty = (cartItem.quantity || 1) + qty;

    await databases.updateDocument(
      appwrite.databaseId,
      appwrite.cartCollectionId,
      cartItem.$id,
      {
        quantity: updatedQty,
      }
    );
  } else {
    await databases.createDocument(
      appwrite.databaseId,
      appwrite.cartCollectionId,
      ID.unique(),
      {
        user_id: user.id,
        product_id: productId,
        product_detail: productId,
        shippingOption: String(1),
        quantity: qty,
      }
    );
  }

  revalidatePath("/");
}

export type cartType = {
  product_id: string;
  quantity: number;
  product_detail: Product;
  shippingOption: DeliveryType;
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
};

export async function getCart() {
  const user = await currentUser();
  if (!user) {
    return redirect("/sign-in");
  }
  const { databases } = await createAdminClient();
  try {
    const { documents }: { documents: cartType[] } =
      await databases.listDocuments<cartType>(
        appwrite.databaseId,
        appwrite.cartCollectionId,
        [Query.equal("user_id", user.id)]
      );
    return documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateCartDelivery(
  cartId: string,
  newDeliveryId: string
) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { databases } = await createAdminClient();
  try {
    await databases.updateDocument(
      appwrite.databaseId,
      appwrite.cartCollectionId,
      cartId,
      { shippingOption: newDeliveryId }
    );
    revalidatePath("/checkout");
  } catch (error) {
    console.error(error);
  }
}

export async function deleteCartFromDB(cartId: string) {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const { databases } = await createAdminClient();
  try {
    await databases.deleteDocument(
      appwrite.databaseId,
      appwrite.cartCollectionId,
      cartId
    );
    revalidatePath("/checkout");
  } catch (error) {
    console.error(error);
  }
}

export async function updateQty(cartId: string, formdata: FormData) {
  const user = await auth();
  if (!user) {
    redirect("/sign-in");
  }
  const { databases } = await createAdminClient();
  const newQty = formdata.get("newQty");
  try {
    await databases.updateDocument(
      appwrite.databaseId,
      appwrite.cartCollectionId,
      cartId,
      {
        quantity: Number(newQty),
      }
    );
    revalidatePath("/checkout");
  } catch (error) {
    console.error(error);
  }
}

export async function clearCart(userId: string) {
  const { databases } = await createAdminClient();

  try {
    const response = await databases.listDocuments(
      appwrite.databaseId,
      appwrite.cartCollectionId,
      [Query.equal("user_id", userId)]
    );

    const deletePromises = response.documents.map((doc) =>
      databases.deleteDocument(
        appwrite.databaseId,
        appwrite.cartCollectionId,
        doc.$id
      )
    );

    await Promise.all(deletePromises);

    revalidatePath("/checkout");
  } catch (error) {
    console.error("Failed to clear cart:", error);
  }
}

export async function cartLenght() {
  const user = await currentUser();
  if (!user) {
    return [];
  }
  const { databases } = await createAdminClient();
  try {
    const { documents }: { documents: cartType[] } =
      await databases.listDocuments<cartType>(
        appwrite.databaseId,
        appwrite.cartCollectionId,
        [Query.equal("user_id", user.id)]
      );
    return documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}
