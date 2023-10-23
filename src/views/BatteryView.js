import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useBattery from '../hooks/useBattery'

const BatteryView = () => {
    const { batteryLevel, chargingStatus } = useBattery();
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Battery data</Text>
            <Text style={styles.body}>Battery Level: {batteryLevel}%</Text>
            <Text style={styles.body}>Charging Status: {chargingStatus === 1 ? 'Charging' : 'Not Charging'}</Text>
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

export default BatteryView;