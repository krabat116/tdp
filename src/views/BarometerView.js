import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useBarometerAndSend from '../hooks/useBarometer';

const BarometerView = () => {
    const { barometerData } = useBarometerAndSend()
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Barometer</Text>
            <Text style={styles.body}>{`Pressure: ${barometerData.pressure}`}</Text>
            <Text style={styles.body}>{`Relative Altitude: ${barometerData.relativeAltitude}`}</Text>
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

export default BarometerView;