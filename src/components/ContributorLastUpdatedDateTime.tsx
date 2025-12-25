import React, { useEffect, useState } from 'react';
import { useColorModeValue } from '@chakra-ui/react';

interface ContributorLastUpdatedDateTimeProps {
  name: string;
}

interface SyncData {
  lastSyncAt: string;
  totalActivities: number;
  repositories: {
    repository: string;
    lastSyncAt: string;
    activitiesProcessed: number;
    status: string;
  }[];
}

const ContributorLastUpdatedDateTime: React.FC<ContributorLastUpdatedDateTimeProps> = ({ name }) => {
  const [syncData, setSyncData] = useState<SyncData | null>(null);
  const [nextUpdateTime, setNextUpdateTime] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const textColor = useColorModeValue('#6B7280', '#9CA3AF');

  useEffect(() => {
    const fetchSyncStatus = async () => {
      try {
        const response = await fetch('/api/contributors/lastSyncTime');
        if (!response.ok) {
          throw new Error('Failed to fetch sync status');
        }
        const data = await response.json();
        setSyncData(data);
        
        // Calculate next update time (4 hours from last sync)
        if (data.lastSyncAt) {
          const lastSync = new Date(data.lastSyncAt);
          const nextUpdate = new Date(lastSync.getTime() + 4 * 60 * 60 * 1000);
          setNextUpdateTime(nextUpdate.toISOString());
        }
        
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchSyncStatus();

    // Refresh every 1 minute to keep countdown accurate
    const intervalId = setInterval(fetchSyncStatus, 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <div className='flex justify-between mx-12 lg:text-[14px] text-xs py-4 bottom-0'>
        <div>
          <p className='px-3 rounded-[0.55rem] py-1' style={{ color: textColor }}>EIPsInsight.com</p>
        </div>
        <div className='px-3 rounded-[0.55rem] py-1' style={{ color: textColor }}>
          <p>Error loading sync status</p>
        </div>
      </div>
    );
  }

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const hoursStr = String(hours).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hoursStr}:${minutes} ${ampm}`;
  };

  return (
    <>
      <div className='flex justify-between mx-12 lg:text-[14px] text-xs py-4 bottom-0'>
        <div>
          <p className='px-3 rounded-[0.55rem] py-1' style={{ color: textColor }}>
            EIPsInsight.com
          </p>
        </div>
        <div className='px-3 rounded-[0.55rem] py-1' style={{ color: textColor }}>
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

export default ContributorLastUpdatedDateTime;
