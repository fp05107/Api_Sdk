import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { getYogini_maha, getYogini_sub, getLifeRhythm, getAshtakvarga, getSarvashtakvarga } from '@subu1234/astrosdk';

import * as AstroSdk from '@subu1234/astrosdk'
console.log("🚀 ~ AstroSdk:", AstroSdk)

const Test = () => {
    const year = 2024, month = 8, day = 7, hour = 6, minute = 47, second = 0;
    const latitude = 16.434571; const longitude = 80.566245;
    const planetInput = 'mercury';

    // useEffect(() => {
    //     // Define an async function inside the useEffect
    //     const fgetYogini_maha = async () => {
    //         try {
    //             const Yogini_maha = await getYogini_maha(year, month, day, hour, minute, second);
    //             console.log("🚀 ~ constfgetYogini_maha= ~ Yogini_maha:", JSON.stringify(Yogini_maha))
    //         } catch (error) {
    //             console.log("🚀 ~ constfgetYogini_maha= ~ error:", error)
    //         }
    //     };

    //     // Call the async function
    //     fgetYogini_maha();
    // }, []);


    // useEffect(() => {
    //     // Define an async function inside the useEffect
    //     const fgetYogini_sub = async () => {
    //         try {
    //             const Yogini_sub = await getYogini_sub(year, month, day, hour, minute, second);
    //             // console.log("🚀 ~ constfgetYogini_sub= ~ Yogini_sub:", Yogini_sub)

    //         } catch (error) {
    //             console.log("🚀 ~ constfgetYogini_sub= ~ error:", error)

    //         }
    //     };

    //     // Call the async function
    //     fgetYogini_sub();
    // }, []);

    // useEffect(() => {
    //     // Define an async function inside the useEffect
    //     const fAshtakvarga = async () => {
    //         try {
    //             const bhinnaAshtakVarga = await getAshtakvarga(year, month, day, hour, minute, second, latitude, longitude, planetInput);
    //             console.log("🚀 ~ fAshtakvarga ~ bhinnaAshtakVarga:", bhinnaAshtakVarga)
                
    //         } catch (error) {
    //             console.log("🚀 ~ fAshtakvarga ~ error:", error)
                
    //         }
    //     };
  
    //     // Call the async function
    //     fAshtakvarga();
    // }, []);
  
    // useEffect(() => {
    //     // Define an async function inside the useEffect
    //     const fgetSarvashtakvarga = async () => {
    //         try {
    //             const Sarvashtakvarga = await getSarvashtakvarga(year, month, day, hour, minute, second, latitude, longitude);
    //             console.log("🚀 ~ fgetSarvashtakvarga ~ Sarvashtakvarga:", Sarvashtakvarga)
                
    //         } catch (error) {
    //             console.log("🚀 ~ fgetSarvashtakvarga ~ error:", error)
                
    //         }
    //     };
  
    //     // Call the async function
    //     fgetSarvashtakvarga();
    // }, []);
  
    return (
        <View>
            <Text>Test</Text>
        </View>
    )
}

export default Test

const styles = StyleSheet.create({})