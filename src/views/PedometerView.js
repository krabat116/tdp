import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pedometer } from 'expo-sensors';
// import usePedometerAndSend from '../hooks/usePedometer';

// const PedometerView = () => {




// }



const usePedometerAndSend = () => {

    const [isPedometerAvailable, setIsPedometerAvailable] = useState('checking');
    const [pastStepCount, setPastStepCount] = useState(0);
    const [currentStepCount, setCurrentStepCount] = useState(0);

    const subscribe = async () => {
        const isAvailable = await Pedometer.isAvailableAsync();
        setIsPedometerAvailable(String(isAvailable));

        if (isAvailable) {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 1);

            const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
            if (pastStepCountResult) {
                setPastStepCount(pastStepCountResult.steps);
            }

            return Pedometer.watchStepCount(result => {
                setCurrentStepCount(result.steps);
            });
        }
    };

    useEffect(() => {
        const subscription = subscribe();
        return () => subscription && subscription.remove();
    }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.body}>Pedometer.isAvailableAsync(): {isPedometerAvailable}</Text>
            <Text style={styles.body}>Steps taken in the last 24 hours: {pastStepCount}</Text>
            <Text style={styles.body}>Walk! And watch this go up: {currentStepCount}</Text>
        </View>
    );


}

styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#292929',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 20,
        marginVertical: 5,
        borderRadius: 10
    },
    title: {
        color: 'white',
        fontSize: 20
    },
    body: {
        color: 'white',
        fontSize: 14
    }
})




export default usePedometerAndSend;





// export default PedometerView;