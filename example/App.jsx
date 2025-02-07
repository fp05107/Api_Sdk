import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Test from './Test';

const App = () => {

  // useEffect(() => {
  //   console.log(getYogini_maha);
  //   getYogini_maha(2021, 1, 1, 0, 0, 0).then(console.log);
  // }, []);


  return (
    <Test />
  )

  return (
    <View>
      <Text>App</Text>
    </View>
  )
}

export default App

const styles = StyleSheet.create({})