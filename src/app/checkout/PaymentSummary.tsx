import React from "react";
import { cartType } from "../../actions/cart";
import { formatPrice } from "../../lib/utils/formatPrice";
import { placeOrder } from "../../actions/order";

function PaymentSummary({ cartItems }: { cartItems: cartType[] }) {
  const { cartQuantity, totalCost, shippingHandling } = cartItems.reduce(
    (acc, item) => {
      return {
        cartQuantity: acc.cartQuantity + item.quantity,
        totalCost:
          acc.totalCost + item.product_detail.priceCents * item.quantity,
        shippingHandling: acc.shippingHandling + item.shippingOption.priceCents,
      };
    },
    {
      cartQuantity: 0,
      totalCost: 0,
      shippingHandling: 0,
    }
  );
  const totalBeforeTax = totalCost + shippingHandling;
  const tax = (totalBeforeTax * 10) / 100;
  const orderTotal = totalBeforeTax + tax;

  const paymentInfo = {
    cartQuantity,
    totalCost,
    shippingHandling,
    totalBeforeTax,
    tax,
    orderTotal,
  };

  return (
    <>
      <div className="payment-summary-title">Order Summary</div>
      <div className="payment-summary-row">
        <div>Items ( {paymentInfo.cartQuantity} ):</div>
        <div className="payment-summary-money">
          ${formatPrice(paymentInfo.totalCost)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Shipping &amp; handling:</div>
        <div className="payment-summary-money payment-summary-shipping">
          ${formatPrice(paymentInfo.shippingHandling)}
        </div>
      </div>

      <div className="payment-summary-row subtotal-row">
        <div>Total before tax:</div>
        <div className="payment-summary-money">
          $ {formatPrice(paymentInfo.totalBeforeTax)}
        </div>
      </div>

      <div className="payment-summary-row">
        <div>Estimated tax (10%):</div>
        <div className="payment-summary-money">
          ${formatPrice(paymentInfo.tax)}
        </div>
      </div>

      <div className="payment-summary-row total-row">
        <div>Order total:</div>
        <div className="payment-summary-money payment-summary-totalmoney">
          ${formatPrice(paymentInfo.orderTotal)}
        </div>
      </div>

      <form action={placeOrder}>
        <button className="place-order-button button-primary js-place-order">
          Place your order
        </button>
      </form>
    </>
  );
}

export default PaymentSummary;
