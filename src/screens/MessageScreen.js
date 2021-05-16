import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Dimensions } from 'react-native';
import { Card, Input, Button, Text } from 'react-native-elements';
import { Wave } from 'react-native-animated-spinkit';
import Toast from 'react-native-easy-toast';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import CustomHeader from '../components/molecules/header/CustomHeader';
import { auth, firestore } from '../utils/firebase';
import colors from '../utils/colors';
const { spanishVioletLight, spanishViolet } = colors;

const width = Dimensions.get('screen').width;

export default function MessageScreen({ navigation }) {

    const USER_KEY = 'USER';
    const [toast, setToast] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const getMessageFromFirebase = async () => {
        setLoading(true)
        try {
            const user = await firestore.collection('users').doc(auth.currentUser.uid).get();
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user.data()));
            user.data().message !== undefined ? setMessage(user.data().message) : setMessage('');
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getMessageFromFirebase();
    }, [])

    const handleChange = value => {
        setMessage(value)
    }

    const saveMessage = async () => {
        setLoading(true);
        try {
            const userInAsyncStorage = await AsyncStorage.getItem(USER_KEY);
            const user = JSON.parse(userInAsyncStorage);
            const userEdited = { ...user, message }
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(userEdited))
            const docRef = firestore.collection('users').doc(auth.currentUser.uid);
            await docRef.set(userEdited);
            setLoading(false);
            toast.show(
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons size= {28} color='#fff' name='done' />
                    <Text style={{ color: '#fff', marginLeft: 10 }}>Mensaje Guardado</Text>
                </View>
            )
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }


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
                        value={message}
                        onChangeText={text => handleChange(text)}
                    />
                    {
                        loading ?
                            <Wave size={28} color={spanishViolet} style={{ alignSelf: 'flex-end'}}/>
                            :
                            <Button
                                buttonStyle={styles.saveButton}
                                title='Guardar'
                                onPress={saveMessage}
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
