import Image from "next/image";
import {
  allOrdersBatch,
  OrderItem,
  OrderMetadata,
  orderType,
} from "../../actions/order";
import { formatPrice } from "../../lib/utils/formatPrice";
import "../../styles/pages/orders.css";
import { addToCart } from "../../actions/cart";
import Link from "next/link";
import Header from "../../components/Header";

async function OrderPage() {
  const orders = await allOrdersBatch();
  return (
    <>
      <Header />
      <div className="order-main">
        <div className="page-title">Your Orders</div>
        <div className="orders-grid js-orders-grid">
          <div className="order-container">
            {orders.map((order) => (
              <Order order={order} key={order.$id} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Order({ order }: { order: orderType & OrderMetadata }) {
  const orderPlaced = new Date(order.orderTime).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
  return (
    <>
      <div className="order-header">
        <div className="order-header-left-section">
          <div className="order-date">
            <div className="order-header-label">Order Placed:</div>
            <div>{orderPlaced}</div>
          </div>
          <div className="order-total">
            <div className="order-header-label">Total:</div>
            <div>${formatPrice(order.totalCostCents)}</div>
          </div>
        </div>

        <div className="order-header-right-section">
          <div className="order-header-label">Order ID:</div>
          <div>{order.$id}</div>
        </div>
      </div>

      <div className="order-details-grid mb-5">
        {order.productDetail?.map((product) => {
          return (
            <Product product={product} key={product.$id} orderId={order.$id} />
          );
        })}
      </div>
    </>
  );
}

function Product({
  product,
  orderId,
}: {
  product: OrderItem;
  orderId: string;
}) {
  const orderArrival = new Date(
    product.estimatedDeliveryTime
  ).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
  return (
    <>
      <div>
        <Image
          src={`/${product.product.image}`}
          alt={product.product.name}
          width={200}
          height={150}
          className="w-auto"
        />
      </div>

      <div>
        <div className="orders-product-name">{product.product.name} </div>
        <div className="">Arriving on: {orderArrival} </div>
        <div className="product-quantity">Quantity: {product.quantity} </div>
        <form action={addToCart.bind(null, product.product.$id)}>
          <button className="buy-again-button button-primary">
            <Image
              className="buy-again-icon"
              src="/images/icons/buy-again.png"
              alt={"buy-again-icon"}
              width={20}
              height={20}
            />

            <span className="buy-again-message js-buy-again-message">
              Buy it again
            </span>
          </button>
        </form>
      </div>

      <div>
        <Link href={`tracking?order-id=${orderId}&orderitem-id=${product.$id}`}>
          <button className="track-package-button button-secondary">
            Track package
          </button>
        </Link>
      </div>
    </>
  );
}

export default OrderPage;
