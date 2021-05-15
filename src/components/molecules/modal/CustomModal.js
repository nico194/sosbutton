import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

export default function CustomModal({ visible, width, height, title, color, children  }) {
    console.log('visible: ', visible)
    return (
        <Modal
            animationType='slide'
            transparent={true}
            visible={visible}
            style={[ visible ? styles.centeredView : { flex: 0 }]}
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView , { width, height }]}>
                    <Text h3 style={[styles.modalTitle, { backgroundColor: color }]}>{ title }</Text>
                    <View style={styles.childrenStyle}>
                        { children }
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalTitle: {
        width: '100%',
        padding: 30,
        color: '#fff',
        textAlignVertical: 'center',
        textAlign: 'left',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    childrenStyle: {
        padding: 15,
        width: '100%'
    }
})
