//Author: Enzo HoLeung Kwan

import { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors'; // Change Gyroscope to Accelerometer
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendJsonData } from '../managers/networkManager';

const useAccelerometerAndSend = () => {
    const [accelerometerData, setAccelerometerData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });

    const dataJsonRef = useRef({});

    const dataFetchingInterval = 5000; // 2 seconds - fetch from sensor
    const dataWritingInterval = 10000; // 10 seconds - save to local storage
    const dataSendingInterval = 21000; // 21 seconds - send to server

    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        let subscription;
        let saveInterval;

        const _subscribe = () => {
            subscription = Accelerometer.addListener((accelerometerData) => {
                setAccelerometerData(accelerometerData); // update the accelerometerData state for display on UI

                const timestamp = new Date().toISOString();
                dataJsonRef.current[timestamp] = {
                    x: accelerometerData.x,
                    y: accelerometerData.y,
                    z: accelerometerData.z,
                };
                console.log("dataJsonRef.current:", JSON.stringify(dataJsonRef.current));
            });
            Accelerometer.setUpdateInterval(dataFetchingInterval);
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
                const storedData = await AsyncStorage.getItem('accelerometerLocal');
                let storedDataJson = storedData ? JSON.parse(storedData) : {};

                storedDataJson = { ...storedDataJson, ...dataJsonRef.current };

                await AsyncStorage.setItem('accelerometerLocal', JSON.stringify(storedDataJson));


                // Check if save success
                const storedData2 = await AsyncStorage.getItem('accelerometerLocal');
                console.log("data from local storage after setItem:", JSON.stringify(storedData2));




                dataJsonRef.current = {};
            } catch (error) {
                console.error("Error saving accelerometer data to local storage:", error);
            }
        };
        saveInterval = setInterval(saveDataToLocal, dataWritingInterval);

        const sendDataToServer = async () => {

            console.log("sendDataToServer fire")

            const storedData = await AsyncStorage.getItem('accelerometerLocal');
            let storedDataJson = storedData ? JSON.parse(storedData) : {};

            console.log("finish getting data from local storage")

            sendJsonData(storedDataJson)
                .then(response => {
                    console.log('Server Response:', response.data);
                })
                .catch(error => {
                    console.error('Post Error:', error);
                });

            console.log("finish sending data to server")

            await AsyncStorage.removeItem('accelerometerLocal');
        };
        const sendInterval = setInterval(sendDataToServer, dataSendingInterval);

        _subscribe();

        return () => {
            _unsubscribe();
            clearInterval(saveInterval);
            // clearInterval(sendInterval); // Add this line to clear sendInterval
        };
    }, []);

    return {
        accelerometerData,
        isSubscribed,
        dataJson: dataJsonRef.current,
        subscribe: () => {
            Accelerometer.setUpdateInterval(dataFetchingInterval);
            setIsSubscribed(true);
        },
        unsubscribe: () => {
            setIsSubscribed(false);
        },
    };
};

export default useAccelerometerAndSend;
