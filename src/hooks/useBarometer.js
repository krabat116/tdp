import { useState, useEffect, useRef } from 'react';
import { Barometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendJsonData } from '../managers/networkManager';

const useBarometerAndSend = () => {
    const [barometerData, setBarometerData] = useState({
        pressure: 0,
        relativeAltitude: 0
        // Add other barometer properties here
    });

    const dataJsonRef = useRef({});

    const dataFetchingInterval = 2000; //2 seconds - fetch from sensor
    const dataWritingInterval = 10000; //10 seconds - save to local storage
    const dataSendingInterval = 21000; //31 seconds - send to server

    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        let subscription;
        let saveInterval;

        const _subscribe = () => {
            subscription = Barometer.addListener((barometerData) => {
                setBarometerData(barometerData);

                const timestamp = new Date().toISOString();
                dataJsonRef.current[timestamp] = {
                    pressure: barometerData.pressure,
                    relativeAltitude: barometerData.relativeAltitude,
                    // Add other barometer data properties here
                };
                console.log("dataJsonRef.current:", JSON.stringify(dataJsonRef.current));
            });
            Barometer.setUpdateInterval(dataFetchingInterval);
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
                const storedData = await AsyncStorage.getItem('barometerLocal');
                let storedDataJson = storedData ? JSON.parse(storedData) : {};

                storedDataJson = { ...storedDataJson, ...dataJsonRef.current };

                await AsyncStorage.setItem('barometerLocal', JSON.stringify(storedDataJson));

                dataJsonRef.current = {};
            } catch (error) {
                console.error("Error saving barometer data to local storage:", error);
            }
        };
        saveInterval = setInterval(saveDataToLocal, dataWritingInterval);

        const sendDataToServer = async () => {
            const storedData = await AsyncStorage.getItem('barometerLocal');
            let storedDataJson = storedData ? JSON.parse(storedData) : {};

            sendJsonData(storedDataJson)
                .then(response => {
                    console.log('Server Response:', response.data);
                })
                .catch(error => {
                    console.error('Post Error:', error);
                });

            await AsyncStorage.removeItem('barometerLocal');
        };
        const sendInterval = setInterval(sendDataToServer, dataSendingInterval);

        _subscribe();

        return () => {
            _unsubscribe();
            clearInterval(saveInterval);
        };
    }, []);

    return {
        barometerData,
        isSubscribed,
        dataJson: dataJsonRef.current,
        subscribe: () => {
            Barometer.setUpdateInterval(dataFetchingInterval);
            setIsSubscribed(true);
        },
        unsubscribe: () => {
            setIsSubscribed(false);
        },
    };
};

export default useBarometerAndSend;
