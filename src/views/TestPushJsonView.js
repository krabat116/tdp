//Author: Enzo HoLeung Kwan

import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { sendJsonData } from '../managers/networkManager';
import gyroTestData from '../testData/gyroTestData.json';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const TestPushJsonView = () => {
    return(
        <View style={styles.container}>
            <Text style={styles.title}>TestPushJsonView</Text>
            <Button
                color={'green'}
                title={'Send Data'}
                onPress={() => {
                    sendJsonData(gyroTestData)
                        .then(response => {
                            console.log('Server Response:', response.data);
                        })
                        .catch(error => {
                            console.error('Post Error:', error);
                        });
                }}
            />

            <Button
                color={'green'}
                title={'Clear Gyro Stroage'}
                onPress={() => {
                    AsyncStorage.removeItem('gyroLocal');
                }}
            />
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

export default TestPushJsonView;