import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MagnetometerView = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>Magnetometer</Text>
            <Text style={styles.body}>123</Text>
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

export default MagnetometerView;