import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { Text, Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../components/molecules/header/CustomHeader';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import { auth } from '../utils/firebase'
import colors from '../utils/colors';
const { spanishVioletLight, lightGreen, spanishViolet } = colors;

export default function LogoutScreen({ navigation }) {

    const [loading, setLoading] = useState(false);

    const logout = async () => {
        setLoading(true)
        try {
            await auth.signOut();
            await AsyncStorage.setItem('USER', JSON.stringify({}))
            navigation.navigate('Login');
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error.code, error.message)
        }
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
            <ScrollView contentContainerStyle={{ padding: 15 }}>
                <Text h4 h4Style={{ textAlign: 'left', marginBottom: 30, color: spanishViolet}}>¿Esta seguro que desea salir de la aplicación?</Text>
                <Button
                    onPress={logout}
                    buttonStyle={{ backgroundColor: spanishVioletLight }}
                    title='Salir'
                />
            </ScrollView>
            <CustomFooter navigate={navigation.navigate} page='Logout' />
        </View>
    )
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	}
});
