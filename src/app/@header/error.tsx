"use client";
function errorPage({ error }: { error: Error }) {
  return (
    <div>
      <p>Some Error Occured in header slot: {error.message}</p>
    </div>
  );
}

export default errorPage;
