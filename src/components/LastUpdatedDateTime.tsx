import React, { useEffect, useState } from 'react';

interface DateTimeProps {
  name: string; // Pass the name as a prop
}

const LastUpdatedDateTime: React.FC<DateTimeProps> = ({ name }) => {
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string | null>(null);
  const [nextUpdateTime, setNextUpdateTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLastUpdatedTime = async () => {
      try {
        const response = await fetch(`/api/lastUpdatedTime?name=${encodeURIComponent(name)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch last updated time');
        }
        const data = await response.json();
        setLastUpdatedTime(data.lastUpdatedTime);
        
        // Calculate next update time (5 minutes from last update)
        const lastUpdate = new Date(data.lastUpdatedTime);
        const nextUpdate = new Date(lastUpdate.getTime() + 5 * 60 * 1000);
        setNextUpdateTime(nextUpdate.toISOString());
        
      } catch (err:any) {
        setError(err.message);
      }
    };

    fetchLastUpdatedTime();

    const intervalId = setInterval(fetchLastUpdatedTime, 5 * 60 * 1000);

  return () => clearInterval(intervalId);
  }, [name]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Format the lastUpdatedTime
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  return (
    <>
      <div className='flex justify-between mx-12 lg:text-[14px] text-xs py-4 bottom-0'>
        <div>
          <p className={'text-gray-500 px-3 rounded-[0.55rem] py-1'}>EIPsInsight.com</p>
        </div>
        <div className={'text-gray-500 px-3 rounded-[0.55rem] py-1'}>
          {nextUpdateTime ? (
            <p>Next Update: {formatDateTime(nextUpdateTime)}</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default LastUpdatedDateTime;