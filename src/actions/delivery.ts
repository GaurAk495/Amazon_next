import { createAdminClient } from "../lib/server/appwrite";
import { appwrite } from "../lib/server/appwriteKeys";

export type DeliveryType = {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  priceCents: number;
  days: number;
};

export async function getDeliveryOptions() {
  const { databases } = await createAdminClient();
  try {
    const { documents }: { documents: DeliveryType[] } =
      await databases.listDocuments<DeliveryType>(
        appwrite.databaseId,
        appwrite.deliveryCollectionId
      );
    return documents;
  } catch (error) {
    console.error(error);
    return [];
  }
}
