import { getDeliveryOptions } from "../../actions/delivery";
import { AllDeliveryInput } from "./DeliveryInput";

async function ShippingHTML({
  cartId,
  deliverySelected,
}: {
  cartId: string;
  deliverySelected: string;
}) {
  const deliveryOptions = await getDeliveryOptions();

  return (
    <AllDeliveryInput
      deliveryOptions={deliveryOptions}
      cartId={cartId}
      deliverySelected={deliverySelected}
    />
  );
}

export default ShippingHTML;
