//Author: Enzo HoLeung Kwan

import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

const TestHookView = () => {
    const [bufferedData, setBufferedData] = useState([]);

    useEffect(() => {
      const interval = setInterval(() => {
        const newData = { timestamp: Date.now(), testString: 'test' };
        console.log(`New Data: ${JSON.stringify(newData)}`);

        // setBufferedData((prevData) => [...prevData, newData]);

        setBufferedData((prevData) => {
          const nextData = [...prevData, newData];
          console.log(`Next Data: ${JSON.stringify(nextData)}`);
          return nextData;
        });        
      }, 1000);
  
      return () => clearInterval(interval);
    }, []); 

    useEffect(() => {
      console.log(`bufferedData changed: ${JSON.stringify(bufferedData)}`);
    }, [bufferedData]);
  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>TestHook</Text>
      </View>
    );
};
  
export default TestHookView;
  