import React from 'react'
import { View, Dimensions, StyleSheet } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomModal from '../../molecules/modal/CustomModal';
import colors from '../../../utils/colors';
const { spanishVioletLight } = colors

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

export default function ContactForm({ showModal, setShowModal, contact, setContact, aceptButton }) {

    const { name, phone } = contact;

    const handleChange = (prop, value) => {
        setContact({ ...contact, [prop]: value });
    }

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
                onChangeText={ text => handleChange('name', text)}
                value={name}
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
                onChangeText={ text => handleChange('phone', text)}
                value={phone}
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
