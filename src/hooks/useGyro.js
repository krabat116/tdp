//Author: Enzo HoLeung Kwan

import { useState, useEffect } from 'react';
import { Gyroscope } from 'expo-sensors';


//in this version, the data subscribe works, but didnt implement saving

const useGyro = () => {
  const [gyroData, setGyroData] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    let subscription;

    const _subscribe = () => {
      subscription = Gyroscope.addListener((gyroscopeData) => {
        setGyroData(gyroscopeData);
      });
      Gyroscope.setUpdateInterval(500);
      setIsSubscribed(true);
    };

    const _unsubscribe = () => {
      if (subscription) {
        subscription.remove();
        setIsSubscribed(false);
      }
    };

    _subscribe();

    return _unsubscribe;
  }, []);

  return {
    gyroData,
    isSubscribed,
    subscribe: () => {
      Gyroscope.setUpdateInterval(16);
      setIsSubscribed(true);
    },
    unsubscribe: () => {
      setIsSubscribed(false);
    },
  };
};

export default useGyro;
