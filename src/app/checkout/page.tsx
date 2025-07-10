import Link from "next/link";
import Image from "next/image";
import "../../styles/pages/checkout/checkout-header.css";
import "../../styles/pages/checkout/checkout.css";
import { Metadata } from "next";
import PaymentSummary from "./PaymentSummary";
import { getCart } from "../../actions/cart";
import CartSummary from "./CartSummary";

export const metadata: Metadata = {
  title: "Checkout",
};

async function page() {
  const cartItems = await getCart();
  return (
    <>
      <div className="checkout-header">
        <div className="header-content">
          <div className="checkout-header-left-section">
            <Link href="/">
              <Image
                className="amazon-logo w-auto"
                alt="amazon-logo"
                src="/images/amazon-logo.png"
                width={100}
                height={80}
              />
              <Image
                className="amazon-mobile-logo w-auto"
                alt="amazon-mobile-logo"
                src="/images/amazon-mobile-logo.png"
                width={100}
                height={80}
              />
            </Link>
          </div>

          <div className="checkout-header-middle-section js-checkout-header-middle-section flex gap-2">
            <p>Checkout</p>
            <Link className="return-to-home-link" href="/">
              {`(${cartItems.length} items)`}
            </Link>
          </div>

          <div className="checkout-header-right-section">
            <Image
              src="/images/icons/checkout-lock-icon.png"
              alt="checkout-icon"
              className="w-auto"
              width={100}
              height={80}
            />
          </div>
        </div>
      </div>

      <div className="main">
        <div className="page-title">Review your order</div>

        <div className="checkout-grid">
          <div className="order-summary js-order-summary">
            <CartSummary cartItems={cartItems} />
          </div>

          <div className="payment-summary js-payment-summary">
            <PaymentSummary cartItems={cartItems} />
          </div>
        </div>
      </div>
    </>
  );
}

export default page;
