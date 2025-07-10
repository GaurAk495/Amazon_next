import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white shadow-lg rounded-lg flex w-full max-w-4xl min-h-[500px] overflow-hidden">
        {/* Left side: Branding and text */}
        <div className="flex flex-col justify-center items-start p-12 w-1/2 bg-blue-600 text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
          <p className="text-lg mb-6">
            Sign in to your Amazon account to continue shopping, track orders,
            and enjoy exclusive deals.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-base opacity-90">
            <li>Fast & secure checkout</li>
            <li>Order tracking</li>
            <li>Personalized recommendations</li>
          </ul>
        </div>
        {/* Right side: Clerk SignIn form */}
        <div className="flex flex-col justify-center items-center p-12 w-1/2 bg-white">
          <SignIn />
        </div>
      </div>
    </div>
  );
}
