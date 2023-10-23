import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import { Accelerometer } from 'expo-sensors';
import useAccelerometerAndSend from '../hooks/useAccelero';


const AccelerometerView = () => {
    const { accelerometerData } = useAccelerometerAndSend()
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Accelerometer</Text>
            <Text style={styles.body}>{`X Axis: ${accelerometerData.x}`}</Text>
            <Text style={styles.body}>{`Y Axis: ${accelerometerData.y}`}</Text>
            <Text style={styles.body}>{`Z Axis: ${accelerometerData.z}`}</Text>
        </View>
    )
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

export default AccelerometerView;