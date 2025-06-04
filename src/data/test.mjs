function getMonthName(month) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  return months[month - 1];
}

  const fetchData = async () => {
    try {
      const response = await fetch(`https://eipsinsight.com//api/graphs`);
      const jsonData = await response.json();
      const formattedData = [];
      console.log(jsonData)

      const formattedEIPs = jsonData.flatMap(eip => eip["eips"]?.map(({ category, month, year, count }) => ({
        category,
        date: `${getMonthName(month)} ${year}`,
        value: count
      })));

      console.log(formattedEIPs)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  fetchData()
  

  