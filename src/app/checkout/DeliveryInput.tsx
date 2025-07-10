"use client";

import { startTransition, useEffect, useOptimistic, useState } from "react";
import { updateCartDelivery } from "../../actions/cart";
import { DeliveryType } from "../../actions/delivery";
import { futureDate } from "../../lib/utils/formatDate";

function DeliveryInput({
  delivery,
  cartId,
  optimisticDeliverySelected,
  setOptimisticDeliverySelected,
}: {
  delivery: DeliveryType;
  cartId: string;
  optimisticDeliverySelected: string;
  setOptimisticDeliverySelected: (action: string) => void;
}) {
  const formatDeliveryPriceCents = (priceIncents: number) => {
    return priceIncents === 0 ? "Free" : `$ ${priceIncents / 100}`;
  };

  const [deliveryOptionDate, setDeliveryOptionDate] = useState("");
  useEffect(() => {
    setDeliveryOptionDate(futureDate(delivery.days));
  }, [delivery]);

  const handleOnDeliveryChange = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Prevent multiple rapid clicks
    if (optimisticDeliverySelected === delivery.$id) {
      return;
    }

    startTransition(async () => {
      setOptimisticDeliverySelected(delivery.$id);
      try {
        await updateCartDelivery(cartId, delivery.$id);
      } catch (error) {
        console.error("Failed to update delivery:", error);
      }
    });
  };

  const isSelected = optimisticDeliverySelected === delivery.$id;

  return (
    <div
      className="delivery-option js-delivery-option"
      onClick={handleOnDeliveryChange}
    >
      <input
        type="radio"
        className="delivery-option-input mr-2"
        name={`delivery-${cartId}`}
        value={delivery.$id}
        checked={isSelected} // Use checked instead of defaultChecked
        readOnly
      />
      <div>
        <div className="delivery-option-date">{deliveryOptionDate}</div>
        <div className="delivery-option-price">
          {formatDeliveryPriceCents(delivery.priceCents)}
        </div>
      </div>
    </div>
  );
}

export function AllDeliveryInput({
  deliveryOptions,
  cartId,
  deliverySelected,
}: {
  deliveryOptions: DeliveryType[];
  cartId: string;
  deliverySelected: string;
}) {
  const [optimisticDeliverySelected, setOptimisticDeliverySelected] =
    useOptimistic(deliverySelected, (_, newId: string) => newId);
  return (
    <form>
      {deliveryOptions.map((delivery) => {
        return (
          <DeliveryInput
            key={delivery.$id}
            delivery={delivery}
            cartId={cartId}
            optimisticDeliverySelected={optimisticDeliverySelected}
            setOptimisticDeliverySelected={setOptimisticDeliverySelected}
          />
        );
      })}
    </form>
  );
}
