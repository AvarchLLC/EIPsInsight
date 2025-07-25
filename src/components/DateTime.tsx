import React from 'react';

const DateTime = () => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const date = currentDate.getDate();
  const hour = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  const hour12 = hour % 12 || 12; // Convert to 12-hour format, making sure 0 becomes 12
  const ampm = hour >= 12 ? 'PM' : 'AM';

  return (
    <>
      <div className="flex justify-between mx-12 lg:text-[14px] text-xs py-4 bottom-0">
        <div>
          <p className="text-gray-500 px-3 rounded-[0.55rem] py-1">EIPsInsight.com</p>
        </div>
        <div className="text-gray-500 px-3 rounded-[0.55rem] py-1">
          <p>
            {date < 10 ? '0' + date : date}-
            {month < 10 ? '0' + month : month}-
            {year}{' '}
            {hour12 < 10 ? '0' + hour12 : hour12}:
            {minutes < 10 ? '0' + minutes : minutes} {ampm}
          </p>
        </div>
      </div>
    </>
  );
};

export default DateTime;
