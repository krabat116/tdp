import { useState, useEffect, useRef } from 'react';
import Pedometer from 'expo-sensors'; // Import the Pedometer library
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendJsonData } from '../managers/networkManager';

const usePedometerAndSend = () => {
    const [stepCount, setStepCount] = useState(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const dataJsonRef = useRef({});

    const dataFetchingInterval = 2000; //2 seconds - fetch from sensor
    const dataWritingInterval = 10000; //10 seconds - save to local storage
    const dataSendingInterval = 21000; //31 seconds - send to server

    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        let saveInterval;
        let sendInterval;

        const _subscribe = () => {











            Pedometer.startPedometerUpdatesFromDate(new Date(), (pedometerData) => {
                setStepCount(pedometerData.steps);

                const timestamp = new Date().toISOString();
                dataJsonRef.current[timestamp] = {
                    steps: pedometerData.steps,
                };
                console.log("dataJsonRef.current:", JSON.stringify(dataJsonRef.current));
            });
            setIsSubscribed(true);
        };

        const _unsubscribe = () => {
            Pedometer.stopPedometerUpdates();
            setIsSubscribed(false);
        };

        const saveDataToLocal = async () => {
            try {
                const storedData = await AsyncStorage.getItem('pedometerLocal');
                let storedDataJson = storedData ? JSON.parse(storedData) : {};

                storedDataJson = { ...storedDataJson, ...dataJsonRef.current };

                await AsyncStorage.setItem('pedometerLocal', JSON.stringify(storedDataJson));

                dataJsonRef.current = {};
            } catch (error) {
                console.error("Error saving pedometer data to local storage:", error);
            }
        };
        saveInterval = setInterval(saveDataToLocal, dataWritingInterval);

        const sendDataToServer = async () => {
            const storedData = await AsyncStorage.getItem('pedometerLocal');
            let storedDataJson = storedData ? JSON.parse(storedData) : {};

            sendJsonData(storedDataJson)
                .then(response => {
                    console.log('Server Response:', response.data);
                })
                .catch(error => {
                    console.error('Post Error:', error);
                });

            await AsyncStorage.removeItem('pedometerLocal');
        };
        sendInterval = setInterval(sendDataToServer, dataSendingInterval);

        _subscribe();

        return () => {
            _unsubscribe();
            clearInterval(saveInterval);
            clearInterval(sendInterval);
        };
    }, []);

    return {
        stepCount,
        isSubscribed,
        dataJson: dataJsonRef.current,
        subscribe: () => {
            setIsSubscribed(true);
        },
        unsubscribe: () => {
            setIsSubscribed(false);
        },
    };
};

export default usePedometerAndSend;
