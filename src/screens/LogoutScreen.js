import React, { useEffect } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator } from 'react-native';
import { Text, Button} from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import CustomHeader from '../components/molecules/header/CustomHeader';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import { logoutUser } from '../redux/actions/users';
import colors from '../utils/colors';
const { spanishVioletLight, lightGreen, spanishViolet } = colors;

export default function LogoutScreen({ navigation }) {

    const dispatch = useDispatch();
    const { loading, logged } = useSelector(state => state.users)

    useEffect(() => {
        !logged && navigation.navigate('Login');
    }, [logged])

    const logout = async () => {
        dispatch(logoutUser());
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
