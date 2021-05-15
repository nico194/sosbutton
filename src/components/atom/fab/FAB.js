import React from 'react';
import { StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const width = Dimensions.get('window').width;
const height =	Dimensions.get('window').height;

export default function FAB({ onPress , backgroundColor, positionHeight = 0 ,children  }) {
    return (
        <TouchableOpacity onPress={onPress} style={[ { top: height - positionHeight, backgroundColor: backgroundColor}, styles.container ]}>
            { children }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        zIndex: 1000,
        padding: 15,
        position: 'absolute',
        left: width - 100,
        borderRadius: 50,
        shadowColor: '#000',
        elevation: 7,
        shadowRadius: 5,
        shadowOpacity: 1.0,
        alignItems: 'baseline'        
    }
})
