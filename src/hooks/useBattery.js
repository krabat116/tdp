//Author: Enzo HoLeung Kwan

import { useEffect, useState } from 'react';
import * as Battery from 'expo-battery';

const useBattery = () => {
  const [batteryLevel, setBatteryLevel] = useState(null);
  const [chargingStatus, setChargingStatus] = useState(null);

  const fetchBatteryInfo = async () => {
    try {
      const level = await Battery.getBatteryLevelAsync();
      setBatteryLevel(level * 100);

      const status = await Battery.getBatteryStateAsync();
      setChargingStatus(status);
    } catch (error) {
      console.error('Error fetching battery info:', error);
    }
  };

  useEffect(() => {
    // Fetch battery info initially
    fetchBatteryInfo();

    // Fetch battery info every 1 minute
    const intervalId = setInterval(fetchBatteryInfo, 60000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return { batteryLevel, chargingStatus };
};

export default useBattery;
