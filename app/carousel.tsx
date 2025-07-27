import { StatusBar, StyleSheet, View } from 'react-native'
import React from 'react'
import Slider from '@/components/carousel/Slider'

const Carousel = () => {
    return (
        <>
            <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
            />
            <View style={{ flex: 1 }}>
                <Slider />
            </View>
        </>
    )
}

export default Carousel

const styles = StyleSheet.create({})