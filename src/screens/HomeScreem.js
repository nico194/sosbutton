import React, { useEffect, useState } from 'react'
import { ScrollView, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements'
import CustomHeader from '../components/molecules/header/CustomHeader';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import Contacts from '../components/organims/contacts/Contacts';
import Map from '../components/organims/map/Map';
import Message from '../components/organims/message/Message';
import Logout from '../components/organims/logout/Logout';
import { auth, firestore } from '../utils/firebase';

export default function HomeScreem({ navigation }) {

    const [ component, setComponent ] = useState('Contacts');
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);


    const getUserData = async () => {
        setLoading(true);
        try {
            const { uid } = auth.currentUser;
            const user = await firestore.collection('users').doc(uid).get();
            const userFormatter = user.data();
            setUser(userFormatter);
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserData()
    })

    useEffect(() => {
        !auth.currentUser && navigation.navigate('Login');
    }, [])
    

    return (
        <View style={styles.container}>
            <CustomHeader />
            {
                loading ?
                    <Button
                        title="Loading button"
                        loading
                    />
                    :
                    <ScrollView >
                        <>
                            { component === 'Contacts' && <Contacts user={user} /> } 
                            { component === 'Map' && <Map user={user} /> } 
                            { component === 'Message' && <Message user={user}/> } 
                            { component === 'Logout' && <Logout navigation={navigation} /> }
                        </>
                    </ScrollView>

            }
            <CustomFooter component={component} setComponent={setComponent} />
		</View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    }
})
