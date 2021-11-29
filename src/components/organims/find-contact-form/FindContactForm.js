import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Dimensions, StyleSheet } from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomModal from '../../molecules/modal/CustomModal';
import colors from '../../../utils/colors';
import { setChanged } from '../../../redux/actions/users';
const { spanishVioletLight } = colors

const height = Dimensions.get('screen').height;
const width = Dimensions.get('screen').width;

export default function FindContactForm({ showModal, setShowModal, phone, setPhone, findContact }) {

    const dispatch = useDispatch();
    const { changed, loading } = useSelector(state => state.users);

    useEffect(() => {
        if(changed) {
            dispatch(setChanged(false));
            setShowModal(false);
        }
    }, [changed])

    return (
        <CustomModal
            visible={showModal}
            height={height - 450}
            width={width - 100}
            title='Rastrear Contacto'
            color={spanishVioletLight}
        >
            <Text h4 style={styles.title}>Ingresar el n° de teléfono que desea rastrear: </Text>
            <Input
                placeholder='Telefono'
                keyboardType='numeric'
                value={phone + ''}
                onChangeText={ text => setPhone(text)}
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
                {
                    loading ?
                    <Button
                        title="Loading button"
                        buttonStyle={{ backgroundColor: spanishVioletLight}}
                        loading
                    />
                    :
                    <Button
                        title='Aceptar'
                        buttonStyle={{ backgroundColor: spanishVioletLight}}
                        onPress={findContact}
                    />
                }
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
