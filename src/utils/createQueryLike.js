const createQuery = (queriStart, data, qrEnd = true) => {
  let queri = "";
  const queriMidle = " ORDER BY created_on DESC ";
  const queryEnd =
    qrEnd && data?.limit && data?.limit
      ? ` LIMIT ${data?.limit} OFFSET ${data?.offset}`
      : "";
  Object.entries(data).forEach(([key, value], index) => {
    const indexQuery = index === 0 ? "WHERE " : "AND ";

    if (key === "limit" || key === "offset") return;

    if (index === 0 && key !== "date_between") {
      queri += `WHERE ${key} LIKE "%${value}%" `;
      return;
    }

    if (key === "date_between") {
      // change format date
      const [dateMin, dateMax] = value.split(",");
      const dateObj = (date) =>
        new Date(
          date.replace(/(\d{2}).(\d{2}).(\d{4})/, "$3-$2-$1")
        ).toISOString();

      queri += `${indexQuery} created_on >= "${dateObj(dateMin)}"
       AND created_on <= "${dateObj(dateMax)}" `;
      return;
    }
    queri += `AND ${key} LIKE '%${value}%' `;
    return;
  });
  return queriStart + queri + queriMidle + queryEnd;
};

module.exports = {
  createQuery,
};
