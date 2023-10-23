//Author: Enzo HoLeung Kwan

import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PrintJsonTestingView = () => {
    const [data, setData] = useState(null);

    return(
        <View style={styles.container}>
            <Text style={styles.title}>Json Data</Text>
            <Button
                color={'green'}
                title={'Print Data'}
                onPress={() => {
                    AsyncStorage.getItem('gyroLocal').then((value) => {
                        setData(value);
                    });
                    console.log(data);
                }}
            />
            <Text style={styles.body}>{JSON.stringify(data)}</Text>
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

export default PrintJsonTestingView;