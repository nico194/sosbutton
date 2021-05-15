import React, { useState } from 'react'
import { ScrollView, View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Card, Input, Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ErrorMessage from '../components/atom/error-message/ErrorMessage';
import CustomHeader from '../components/molecules/header/CustomHeader';
import { auth } from '../utils/firebase';
import colors from '../utils/colors';
const { spanishVioletLight, lightGreen } = colors;

const width = Dimensions.get('screen').width;

export default function HomeScreem({ navigation }) {

    const initialStateUser = {
        email: '',
        password: ''
    }

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(initialStateUser);
    const [error, setError] = useState(null);

    const handleChange = (prop, value) => {
        setUser({ ...user, [prop]: value})
    }

    const loginUser = async () => {
        const form = validationForm();
        if (form.isValid) {
            await login();
        } else {
            form.isEmpty && setError({ code: 1, message: 'Complete todos los campos, por favor.' })
        }
    }

    const login = async () => {
        setLoading(true);
        try {
            const userCredencial = await auth.signInWithEmailAndPassword(user.email, user.password)
            if (userCredencial.user.uid){
                setError(null);
                navigation.navigate('Home');
                setLoading(false);
            }
            setLoading(false);
        } catch (err) {
            console.log(err.code, err.message)
            setLoading(false);
            setError(err);
        }
    }

    const validationForm = () => {
        let validate = null;        
        validate = {
            isValid: !emptyForm(),
            isEmpty: emptyForm()
        }
        return validate;
    }

    const emptyForm = () => {
        let emptyEmail = false;
        let emptyPassword = false;

        Object.keys(user).forEach( key => {
            if (key === 'email') {
                emptyEmail = user[key] === '';
            }
            if (key === 'password') {
                emptyPassword = user[key] === '';
            }
        })

        return emptyEmail || emptyPassword;
    }

    if(loading) {
		return (
			<View style={styles.container}>
				<ActivityIndicator size="large" color={lightGreen} style={{ position: 'relative', top: 100}} />
			</View>
		)
	}

    return (
        <View style={styles.container}>
            <CustomHeader />
			<ScrollView>
                <Card containerStyle={{ width: width - 30, marginTop: 100 }}>
                    <Card.Title>Iniciar seción</Card.Title>
                    { error && <ErrorMessage error={error} setError={setError} /> }
                    <View>
                        <Input
                            placeholder='Email'
                            onChangeText={text => handleChange('email', text)}
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
                            placeholder='Contraseña'
                            secureTextEntry={true}
                            onChangeText={text => handleChange('password', text)}
                            leftIcon={
                                <Icon
                                    name='lock'
                                    type= 'font-awesome'
                                    size={24}
                                    color='#000'
                                />
                            }
                        />
                        <View style={styles.actionButtons}>
                            <Button 
                                title='Registrarse'
                                type='clear'
                                titleStyle={{ color: spanishVioletLight }}
                                onPress={() => navigation.navigate('Register')}
                            />
                            <Button 
                                title='Ingresar'
                                buttonStyle={{ backgroundColor: spanishVioletLight}}
                                onPress={loginUser}
                            />
                        </View>
                    </View>
                </Card>
            </ScrollView>
		</View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionButtons: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    }
})
