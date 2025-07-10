export const futureDate = (daysToAdd: number) => {
  const futureDate = new Date(Date.now() + daysToAdd * 24 * 60 * 60 * 1000);

  return futureDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
};

export function formateDate(datevalue: Date) {
  return new Date(datevalue).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "2-digit",
  });
}
