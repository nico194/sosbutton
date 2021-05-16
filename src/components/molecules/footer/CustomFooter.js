import React, { useState } from 'react'
import { View,Text, StyleSheet, TouchableOpacity  } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {footerNav } from '../../../utils/footerNav';
import colors from '../../../utils/colors';
const { xanadu, lightGreen } = colors;

export default function CustomFooter({ navigate, page }) {

    const [navSelected, setNavSelected] = useState(page)

    const goToDestination = destination => {
        setNavSelected(page)
        navigate(destination)
    }

    const navs = footerNav.map( ({ destination, text, icon }, index) => {
        return (
            <TouchableOpacity
                key={destination}
                onPress={() => goToDestination(destination)}
                style={[
                    styles.buttonNav,
                    index === 0 && styles.firstButtonNav,
                    index === footerNav.length - 1 && styles.lastButtonNav,
                    destination === navSelected && styles.selectedNav
                ]}
                >
                    <MaterialIcons 
                        name={icon} 
                        size={28} 
                        color={ navSelected === destination ? lightGreen : xanadu}
                        style={{ textAlign: 'center'}} 
                        />
                    <Text 
                        style={[ navSelected === destination ? {color: lightGreen} : {color: xanadu}, { textAlign: 'center'}]} 
                        >
                        {text}
                    </Text>
            </TouchableOpacity>
        )
    })

    return (
        <View style={styles.containerFooter} >
            { navs }
        </View>
    )
}

const styles = StyleSheet.create({
    containerFooter: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#fff', 
        borderTopLeftRadius: 15, 
        borderTopRightRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            height: 5,
            width: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 20
    },
    buttonNav: {
        width: '25%',
        padding: 5,
        backgroundColor: 'transparent'
    },
    firstButtonNav: {
        borderTopLeftRadius: 15,
    },
    lastButtonNav: {
        borderTopRightRadius: 15,
    },
    selectedNav:{
        borderTopColor: lightGreen,
        borderTopWidth: 3,
    }
})
