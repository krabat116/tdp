//Author: Enzo HoLeung Kwan

import { useState, useEffect, useRef } from 'react';
import { Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage'; 


//data subscribe works, saving works

const useGyro2e = () => {
    const [gyroData, setGyroData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [dataArr, setDataArr] = useState([]);
    const [isSubscribed, setIsSubscribed] = useState(false);

    const dataArrRef = useRef(dataArr);

    useEffect(() => {
        let subscription;
        let saveInterval;

        const _subscribe = () => {
        subscription = Gyroscope.addListener((gyroscopeData) => {
            setGyroData(gyroscopeData);
            setDataArr((prevData) => [...prevData, gyroscopeData]);
        });
        Gyroscope.setUpdateInterval(2000);
        setIsSubscribed(true);
        };

        const _unsubscribe = () => {
        if (subscription) {
            subscription.remove();
            setIsSubscribed(false);
        }
        };

        const saveDataToLocal = async () => {
        try {
            
            // Retrieve current data from AsyncStorage
            const storedData = await AsyncStorage.getItem('gyroLocal');
            let storedDataArr = storedData ? JSON.parse(storedData) : [];

            // Concatenate new dataArrRef.current with the retrieved data
            // console.log("dataArrRef.current in saveDataToLocal:", JSON.stringify(dataArrRef.current));
            const updatedDataArr = [...storedDataArr, ...dataArrRef.current];

            
            // Save the updated array back to AsyncStorage
            // console.log(`Saving updatedDataArr to local storage...${JSON.stringify(updatedDataArr)}`);
            await AsyncStorage.setItem('gyroLocal', JSON.stringify(updatedDataArr));

            // Check if save success
            const storedData2 = await AsyncStorage.getItem('gyroLocal');
            console.log("data from local storage after setItem:", JSON.stringify(storedData2));

            setDataArr([]);
            // console.log("DataArr cleared");
        } catch (error) {
            console.error("Error saving gyro data to local storage:", error);
        }
        };

        _subscribe();

        saveInterval = setInterval(saveDataToLocal, 10000); // Save every 10 seconds.

        return () => {
        _unsubscribe();
        clearInterval(saveInterval); 
        };
    }, []);

    useEffect(() => {
        dataArrRef.current = dataArr;

        // console.log("Number of data points in dataArr:", dataArr.length);
        // console.log("dataArr:", JSON.stringify(dataArr));
        // console.log("dataArrRef:", JSON.stringify(dataArrRef.current));
    }, [dataArr]);
  

    return {
        gyroData,
        isSubscribed,
        dataArr,
        subscribe: () => {
            Gyroscope.setUpdateInterval(16);
            setIsSubscribed(true);
        },
        unsubscribe: () => {
            setIsSubscribed(false);
        },
    };
};

export default useGyro2e;
