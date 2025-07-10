import Image from "next/image";
import { cartType } from "../../actions/cart";
import ShippingHTML from "./ShippingHTML";
import { formatPrice } from "../../lib/utils/formatPrice";
import UpdateCart from "./UpdateCart";
import { futureDate } from "../../lib/utils/formatDate";

function CartItem({ cartItem }: { cartItem: cartType }) {
  return (
    <div className="cart-item-container jstest-cart-item-container">
      <div className="delivery-date">
        Delivery date: {futureDate(cartItem.shippingOption.days)}
      </div>
      <div className="cart-item-details-grid">
        <Image
          className="product-image w-auto"
          src={`/${cartItem.product_detail.image}`}
          alt="product-image"
          width={250}
          height={150}
        />

        <div className="cart-item-details">
          <div className="checkout-product-name">
            {cartItem.product_detail.name}
          </div>
          <div className="product-price">
            ${formatPrice(cartItem.product_detail.priceCents)}
          </div>
          <UpdateCart
            qty={cartItem.quantity}
            cartId={cartItem.$id}
            productTitle={cartItem.product_detail.name}
            image={cartItem.product_detail.image}
          />
        </div>
        <div className="delivery-options">
          <div className="delivery-options-title">
            Choose a delivery option:
          </div>
          <ShippingHTML
            cartId={cartItem.$id}
            deliverySelected={cartItem.shippingOption.$id}
          />
        </div>
      </div>
    </div>
  );
}

export default CartItem;
