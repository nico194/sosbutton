import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Header, Text } from 'react-native-elements';
import colors from '../../../utils/colors';
const { spanishVioletLight } = colors;

import '@expo/vector-icons'; // 5.2.0

export default function CustomHeader() {
    return (
        <Header
            containerStyle={{ borderBottomEndRadius: 10, borderBottomStartRadius: 10}}
            centerComponent={
                <View style={{ flexGrow: 1, flexDirection: 'row', justifyContent: 'center', position: 'relative', right: 50 }}>
                    <Image 
                        source={require('../../../../assets/SOS.png')}
                        style={styles.image}
                    />
                    <Text h2 style={{ position: 'relative', top: 40, color: '#fff' }}>Sos Button</Text>
                </View>
            }
            backgroundColor={ spanishVioletLight }
        />
    )
}

const styles = StyleSheet.create({
    image: {
        position: 'relative',
        top: 20,
        width:100,
        height: 100
    }
});
