import React, { useState } from 'react'
import { ScrollView, View, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { Card, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import ErrorMessage from '../components/atom/error-message/ErrorMessage';
import CustomHeader from '../components/molecules/header/CustomHeader';
import { auth, firestore } from '../utils/firebase';
import colors from '../utils/colors';
const { spanishVioletLight, lightGreen } = colors;

const width = Dimensions.get('screen').width;

export default function RegisterScreem({ navigation }) {

    const initialStateUser = {
        name: '',
        email: '',
        phone: 0,
        password: '',
        repeatPassword: ''
    }

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(initialStateUser);
    const [error, setError] = useState(null);
    
    const handleChange = (prop, value) => {
        setUser({ ...user, [prop]: value });
    }

    const registerUser = async () => {
        const form = validationForm();
        if (form.isValid) {
            await register();
        } else {
            form.isEmpty && setError({ code: 1, message: 'Complete todos los campos, por favor.' })
            form.isRepeatPassword && setError({ code: 2, message: 'Los campos de contraseña deben ser iguales.' })
        }
    }

    const register = async () => {
        setLoading(true);
        try {
            const userCredencial = await auth.createUserWithEmailAndPassword(user.email, user.password);
            if (userCredencial.user.uid) {
                delete user.password;
                delete user.repeatPassword;
                const userAuthenticated = { ...user, uid: userCredencial.user.uid};
                await firestore.collection('users').doc(userCredencial.user.uid).set(userAuthenticated);
                setError(null);
                navigation.navigate('Home');
                setLoading(false);
            }
            setLoading(false);
        } catch (err) {
            console.log(err.code, err.message)
            setError(err);
            setLoading(false);
        }
    }

    const validationForm = () => {
        let validate = null;
        
        validate = {
            isValid: isRepeatPassword() && !emptyForm(),
            isRepeatPassword: !isRepeatPassword(),
            isEmpty: emptyForm()
        }
        console.log('validate: ', validate)
        return validate;
    }

    const isRepeatPassword = () => {
        return user.password === user.repeatPassword;
    }

    const emptyForm = () => {
        let emptyName = false;
        let emptyEmail = false;
        let emptyPhone = false;
        let emptyPassword = false;
        let emptyRepeatPassword = false;

        Object.keys(user).forEach( key => {
            if (key === 'name') {
                emptyName = user[key] === '';
            }
            if (key === 'email') {
                emptyEmail = user[key] === '';
            }
            if (key === 'phone') {
                emptyPhone = user[key] === '';
            }
            if (key === 'password') {
                emptyPassword = user[key] === '';
            }
            if (key === 'repeatPassword') {
                emptyRepeatPassword = user[key] === '';
            }
        })

        return emptyName || emptyEmail || emptyPhone || emptyPassword || emptyRepeatPassword;
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
                <Card containerStyle={{ width: width - 30 }}>
                    <Card.Title>Registrarse</Card.Title>
                    { error && <ErrorMessage error={error} setError={setError} /> }
                    <View>
                        <Input
                            placeholder='Nombre'
                            onChangeText={text => handleChange('name', text)}
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
                            placeholder='Email'
                            onChangeText={text => handleChange('email', text)}
                            leftIcon={
                                <Icon
                                    name='envelope'
                                    type= 'font-awesome'
                                    size={24}
                                    color='#000'
                                />
                            }
                        />
                        <Input
                            placeholder='Teléfono'
                            onChangeText={text => handleChange('phone', text)}
                            leftIcon={
                                <Icon
                                    name='phone'
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
                        <Input
                            placeholder='Repetir Contraseña'
                            secureTextEntry={true}
                            onChangeText={text => handleChange('repeatPassword', text)}
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
                                title='Volver'
                                type='clear'
                                titleStyle={{ color: spanishVioletLight }}
                                onPress={() => navigation.navigate('Login')}
                            />
                            <Button 
                                title='Ingresar'
                                buttonStyle={{ backgroundColor: spanishVioletLight}}
                                onPress={registerUser}
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
