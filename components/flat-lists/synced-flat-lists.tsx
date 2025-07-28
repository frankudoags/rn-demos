import { Dimensions, FlatList, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { Image } from 'expo-image';
import { DUMMY_IMAGES } from '../image-list';

const { width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
} = Dimensions.get('screen');

const IMAGE_SIZE = 80;
const SPACING = 10;
const TOTAL_THUMB_SIZE = IMAGE_SIZE + SPACING;

/**
 * How it works:
 * - We have two FlatLists, one for the big images and one for the thumbnails.
 * - The big FlatList is horizontal and paginated and each image takes up the full width,
 *  showing one image at a time.
 * - The small FlatList is also horizontal and shows thumbnails of the images, with specific size of `IMAGE_SIZE`.
 * 
 * - When the user scrolls the big FlatList, we calculate the index of the current image and update the active thumbnail.
 * What that basically does is to setthe index variable, which the lets the small FlatList know which thumbnail to scroll to.
 * 
 * - When the user taps on a thumbnail, we scroll the big FlatList to the corresponding image,
 *  we update the user's active index, and the small FlatList scrolls to the corresponding thumbnail.
 * 
 * from @catalin miron on youtube https://www.youtube.com/watch?v=pTtxhuThMew&ab_channel=CatalinMiron
 */

const SyncedLists = () => {
    const bigRef = useRef<FlatList>(null);
    const smallRef = useRef<FlatList>(null);

    const [activeIndex, setActiveIndex] = React.useState(0);

    const setIndex = (index: number) => {
        setActiveIndex(index);
        if (smallRef.current) {
            smallRef.current.scrollToOffset({
                offset: index * TOTAL_THUMB_SIZE,
                animated: true 
            });
        }
    }

    const smallListSetIndex = (index: number) => {
        setActiveIndex(index);
        if (bigRef.current) {
            bigRef.current.scrollToOffset({
                offset: index * SCREEN_WIDTH,
                animated: true,
            });
        }
    }


    return (
        <View style={{ flex: 1, backgroundColor: "black" }}>
            {/* Big FlatList */}
            <FlatList
                data={DUMMY_IMAGES}
                ref={bigRef}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onMomentumScrollEnd={(event) => {
                    const index = Math.floor(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
                    setIndex(index);
                }}
                renderItem={({ item, index }) => (
                    <View
                        key={index}
                        style={{
                            width: SCREEN_WIDTH,
                            height: SCREEN_HEIGHT,
                            overflow: 'hidden',
                        }}>
                        <Image
                            style={StyleSheet.absoluteFillObject}
                            source={item.source}
                        />
                    </View>
                )}
            />
            {/* Overlay */}
            <View pointerEvents='none' style={styles.overlay} />
            {/* Small FlatList */}
            <FlatList
                data={DUMMY_IMAGES}
                keyExtractor={item => item.id}
                ref={smallRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingHorizontal: SCREEN_WIDTH / 2 - IMAGE_SIZE / 2
                }}
                style={{ position: 'absolute', bottom: IMAGE_SIZE, zIndex: 2 }}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => smallListSetIndex(index)}
                        style={{
                            width: IMAGE_SIZE,
                            height: IMAGE_SIZE,
                            borderWidth: 2,
                            borderColor: index === activeIndex ? "gray" : "transparent",
                            borderRadius: 12,
                            marginRight: SPACING,
                        }}
                    >
                        <Image
                            style={{
                                width: "100%",
                                height: "100%",
                                borderRadius: 12,
                            }}
                            source={item.source}
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}

export default SyncedLists

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: SCREEN_HEIGHT,
        zIndex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)',
        justifyContent: 'center',
    }
})