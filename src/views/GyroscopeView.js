//Author: Enzo HoLeung Kwan

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useGyro from '../hooks/useGyro';
import useGyro2e from '../hooks/useGyro2e';
import useGyro2f from '../hooks/useGyro2f';
import useGyro2g from '../hooks/useGyro2g';


const GyroscopeView = () => {
    const { gyroData } = useGyro2g()
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Gyroscope</Text>
            <Text style={styles.body}>{`X Axis: ${gyroData.x}`}</Text>
            <Text style={styles.body}>{`Y Axis: ${gyroData.y}`}</Text>
            <Text style={styles.body}>{`Z Axis: ${gyroData.z}`}</Text>
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

export default GyroscopeView;