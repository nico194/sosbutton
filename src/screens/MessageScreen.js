import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Card, Input, Button, Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { Wave } from 'react-native-animated-spinkit';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-easy-toast';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import CustomHeader from '../components/molecules/header/CustomHeader';
import { saveMessage, setChanged } from '../redux/actions/users';
import colors from '../utils/colors';
const { spanishVioletLight, spanishViolet } = colors;

const width = Dimensions.get('screen').width;

export default function MessageScreen({ navigation }) {

    const [toast, setToast] = useState(null);
    const [userMessage, setUserMessage] = useState('');

    const dispatch = useDispatch();
    const { loading, changed, message } = useSelector(state => state.users)

    const handleChange = value => {
        setUserMessage(value)
    }

    useEffect(() => {
        setUserMessage(message);
    }, [message])

    useEffect(() => {
        if (changed) {
            dispatch(setChanged());
            toast.show(
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons size= {28} color='#fff' name='done' />
                    <Text style={{ color: '#fff', marginLeft: 10 }}>Mensaje actualizado</Text>
                </View>
            )
        }
    }, [changed, message])

    return (
        <View style={styles.container}>
            <CustomHeader />
            <Text h3 h3Style={{ padding: 15, color: spanishViolet }}>Mensaje</Text>
            <ScrollView>
                <Card>
                    <Card.Title style={styles.titleStyle}>Mensage de Emergencia</Card.Title>
                    <Input
                        style={styles.messageStyle}
                        multiline={true}
                        numberOfLines={4}
                        placeholder='Ingrese un mensaje predeterinado de pánico'
                        value={userMessage}
                        onChangeText={text => handleChange(text)}
                    />
                    {
                        loading ?
                            <Wave size={28} color={spanishViolet} style={{ alignSelf: 'flex-end'}}/>
                            :
                            <Button
                                buttonStyle={styles.saveButton}
                                title='Guardar'
                                onPress={() => dispatch(saveMessage(userMessage))}
                            />
                    }
                </Card>
            </ScrollView>
            <Toast 
                ref={(toast) => setToast(toast)}
                opacity={0.9}
                style={{ backgroundColor: spanishVioletLight, width: width - 30 }}
                textStyle={{ color: '#fff' }}
            />
            <CustomFooter navigate={navigation.navigate} page='Message' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
	},
    titleStyle: {
        textAlign: 'left'
    },
    messageStyle: {
        textAlignVertical:'top'
    },
    saveButton: {
        backgroundColor: spanishVioletLight,
        width: '50%',
        alignSelf: 'flex-end'
    }
})
