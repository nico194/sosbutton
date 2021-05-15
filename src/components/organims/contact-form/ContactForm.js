import React from 'react'
import { View, Dimensions, StyleSheet } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomModal from '../../molecules/modal/CustomModal';
import colors from '../../../utils/colors';
const { spanishVioletLight } = colors

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

export default function ContactForm({ showModal, setShowModal, aceptButton }) {
    return (
        <CustomModal
            visible={showModal}
            height={height - 400}
            width={width - 100}
            title='Agregar Contacto'
            color={spanishVioletLight}
        >
            <Text h4 style={styles.title}>Ingresar nuevo contacto:</Text>
            <Input
                placeholder='Nombre'
                leftIcon={
                    <Icon
                        name='user'
                        type= 'font-awesome'
                        size={24}
                        color='#000'
                    />
                }
            />
            <Input
                placeholder='Telefono'
                keyboardType='numeric'
                leftIcon={
                    <Icon
                        name='phone'
                        type= 'font-awesome'
                        size={24}
                        color='#000'
                    />
                }
            />
            <View style={styles.actionButtons}>
                <Button 
                    title='Cerrar'
                    buttonStyle={{ backgroundColor: spanishVioletLight}}
                    onPress={() => setShowModal(false)}
                />
                <Button 
                    title='Aceptar'
                    buttonStyle={{ backgroundColor: spanishVioletLight}}
                    onPress={aceptButton}
                />
            </View>
        </CustomModal>
    )
}

const styles = StyleSheet.create({
    title: {
        marginBottom: 20
    },  
    actionButtons: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    }
})
