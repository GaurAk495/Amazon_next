"use client";
function errorPage({ error }: { error: Error }) {
  return (
    <div>
      <p>Some Error Occured in children slot: {error.message}</p>
    </div>
  );
}

export default errorPage;
