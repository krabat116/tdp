//Author: Enzo HoLeung Kwan

import { useState, useEffect, useRef } from 'react';
import { Gyroscope } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { sendJsonData } from '../managers/networkManager';

//data subscribe works, saving works

const useGyro2f = () => {
    const [gyroData, setGyroData] = useState({
        x: 0,
        y: 0,
        z: 0,
    });
    const [dataJson, setDataJson] = useState({});
    const dataJsonRef = useRef(dataJson);

    const dataFetchingInterval = 2000; //2 seconds - fetch form sensor
    const dataWritingInterval = 10000; //10 seconds - save to local storage
    const dataSendingInterval = 21000; //31 seconds - send to server

    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        let subscription;
        let saveInterval;


        //Subscribe to the sensor
        const _subscribe = () => {
        subscription = Gyroscope.addListener((gyroscopeData) => {
            setGyroData(gyroscopeData); //update the gyroData state for display on UI

            //Save the data to the dataJson state
            //With a format of {timestamp: {x: x, y: y, z: z}}
            const timestamp = new Date().toISOString();
            setDataJson((prevDataJson) => ({ ...prevDataJson,
                [timestamp]: {
                    x: gyroscopeData.x,
                    y: gyroscopeData.y,
                    z: gyroscopeData.z,
                },
            }))
        });
        Gyroscope.setUpdateInterval(dataFetchingInterval);
        setIsSubscribed(true);
        };


        //Unsubscribe from the sensor
        const _unsubscribe = () => {
        if (subscription) {
            subscription.remove();
            setIsSubscribed(false);
        }
        };



        // Function to save data to local storage every X seconds
        const saveDataToLocal = async () => {
        try {
            
            // Retrieve current data from AsyncStorage
            const storedData = await AsyncStorage.getItem('gyroLocal');
            let storedDataJson = storedData ? JSON.parse(storedData) : {};

            // Concatenate new dataArrRef.current with the retrieved data
            storedDataJson = { ...storedDataJson, ...dataJsonRef.current };
            
            // Save the updated array back to AsyncStorage
            await AsyncStorage.setItem('gyroLocal', JSON.stringify(storedDataJson));

            // Check if save success
            const storedData2 = await AsyncStorage.getItem('gyroLocal');
            console.log("data from local storage after setItem:", JSON.stringify(storedData2));

            setDataJson({});
            dataJsonRef.current = {};
        } catch (error) {
            console.error("Error saving gyro data to local storage:", error);
        }
        };
        saveInterval = setInterval(saveDataToLocal, dataWritingInterval); 



        // Function to send data to the server every X seconds
        const sendDataToServer = async () => {
            console.log("sendDataToServer fire")
            // Retrieve current data from AsyncStorage
            const storedData = await AsyncStorage.getItem('gyroLocal');
            let storedDataJson = storedData ? JSON.parse(storedData) : {};
            console.log("finish getting data from local storage")

            //Send to server, using func from NetworkManager Script
            sendJsonData(storedDataJson)
                .then(response => {
                    console.log('Server Response:', response.data);
                })
                .catch(error => {
                    console.error('Post Error:', error);
                });
            console.log("finish sending data to server")
        };
        const sendInterval = setInterval(sendDataToServer, dataSendingInterval);





        _subscribe();

        return () => {
            _unsubscribe();
            clearInterval(saveInterval); 
        };
    }, []);

    
    
    //When the temp json variable update, save it to the ref variable
    useEffect(() => {
        // console.log(`dataJson is now ${JSON.stringify(dataJson)}`)
        dataJsonRef.current = dataJson;
    }, [dataJson]);
  

    return {
        gyroData,
        isSubscribed,
        dataJson,
        subscribe: () => {
            Gyroscope.setUpdateInterval(16);
            setIsSubscribed(true);
        },
        unsubscribe: () => {
            setIsSubscribed(false);
        },
    };
};

export default useGyro2f;
