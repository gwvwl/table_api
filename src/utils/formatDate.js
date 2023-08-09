const changeDateFormat = (data) =>
    data.map(({ created_on, ...rest }) => {
        const date = new Date(created_on);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        const formatDate = `${day}.${month}.${year}`;
        return { created_on: formatDate, ...rest };
    });

module.exports = {
    changeDateFormat,
};
