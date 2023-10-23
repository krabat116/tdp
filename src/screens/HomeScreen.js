import React from "react";
import { Text, StyleSheet, SafeAreaView, FlatList, View } from "react-native";
import AccelerometerView from '../views/AccelerometerView';
import BarometerView from "../views/BarometerView";
import PedometerView from "../views/PedometerView";


const HomeScreen = () => {
  const data = [
    { key: '1', component: <AccelerometerView />, height: 150 },
    { key: '2', component: <BarometerView />, height: 150 },
    { key: '3', component: <PedometerView />, height: 150 }



  ];







  const renderItem = ({ item }) => {
    return <View style={{ height: item.height, marginVertical: 5 }}>{item.component}</View>;


  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
      />
    </SafeAreaView>
  );


};


const styles = StyleSheet.create({
  text: {
    fontSize: 30,
  },
});

export default HomeScreen;



