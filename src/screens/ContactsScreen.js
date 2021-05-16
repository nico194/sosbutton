import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Alert, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { Wave } from 'react-native-animated-spinkit';
import Toast from 'react-native-easy-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FAB from '../components/atom/fab/FAB';
import Contact from '../components/molecules/contact/Contact';
import CustomHeader from '../components/molecules/header/CustomHeader';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import ContactForm from '../components/organims/contact-form/ContactForm';
import { auth, firestore, getNewId } from '../utils/firebase';
import colors from '../utils/colors';
const { spanishVioletLight, spanishViolet } = colors;

const width = Dimensions.get('screen').width;

export default function ContactsScreen({ navigation }) {

    const initialStateContact = {
        id: 0,
        name: '',
        phone: ''
    };

    const USER_KEY = 'USER';
    const [contact, setContact] = useState(initialStateContact);
    const [contactSelected, setContactSelected] = useState(initialStateContact);
    const [contacts, setContacts] = useState([])
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [loading, setLoading] = useState(false);

    const getContactFromFirebase = async () => {
        setLoading(true)
        try {
            const user = await firestore.collection('users').doc(auth.currentUser.uid).get();
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(user.data()));
            user.data().contacts !== undefined ? setContacts(user.data().contacts) : setContacts([]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    }

    useEffect(() => {
        getContactFromFirebase();
    }, [])

    const constactsList = contacts !== undefined && contacts.map((contact, index) => {
        return (
            <Contact
                key={index}
                contact={contact}
                contactSelected={contactSelected}
                setContactSelected={setContactSelected}
                deleteContact={() => openDeleteAlert()}
                updateContact={() => updateContact(contact.id)}
            />
        )
    });

    const showContactForm = async () => {
        setShowModal(!showModal);
    }

    const saveContacts = async (newContacts) => {
        const userInAsyncStorage = await AsyncStorage.getItem(USER_KEY);
        const user = JSON.parse(userInAsyncStorage);
        const userEdited = { ...user, contacts: newContacts }
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(userEdited))
        const docRef = firestore.collection('users').doc(auth.currentUser.uid);
        await docRef.set(userEdited);
    }

    const saveContact = async () => {
        setLoading(true);
        try {
            const newContact = { ...contact, id: getNewId() };
            contacts.push(newContact);
            await saveContacts(contacts);
            setContact({});
            setLoading(false);
            setShowModal(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const openDeleteAlert = () => {
        Alert.alert(
            'Eliminar Contacto',
            'Esta seguro que desea eliminar el contacto?',
            [
                {
                    text: "Cancelar",
                    onPress: () => {},
                    style: "cancel"
                },
                {
                    text: 'Aceptar',
                    onPress: () => removeContact(contactSelected.id),
                }
            ],
            { cancelable: false }
        )
    }

    const removeContact = async (id) => {
        setLoading(true)
        try {
            const contactsDeleted = contacts.filter(element => element.id !== id);
            setContacts(contactsDeleted);
            await saveContacts(contactsDeleted);
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    const updateContact = async (id) => {
        setLoading(true)
        try {
            const contactsUpdated = contacts.map( element => element.id === id ? { ...element, name: contactSelected.name, phone: contactSelected.phone } : element )
            setContacts(contactsUpdated);
            await saveContacts(contactsUpdated);
            toast.show(
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons size= {28} color='#fff' name='done' />
                    <Text style={{ color: '#fff', marginLeft: 10 }}>Contacto actualizado</Text>
                </View>
            )
            setLoading(false);
        } catch (error) {
            console.log(error)
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <CustomHeader />
            <FAB 
				backgroundColor={spanishVioletLight}
				onPress={showContactForm}
				positionHeight={150}
				>
				<MaterialIcons name='add' size={32} color='#fff' />
			</FAB>
            <ScrollView>
                <Text h3 h3Style={{ padding: 15, color: spanishViolet }}>Contactos</Text>
                <ContactForm
                    loading={loading}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    contact={contact}
                    setContact={setContact}
                    aceptButton={saveContact}
                    />
                { 
                    loading ?
                        <Wave size={48} color={spanishViolet} style={{ alignSelf: 'center'}}/>
                        :
                        contacts.length === 0 ?
                            <Text h4 h4Style={{ paddingHorizontal: 15}}>No hay contactos registrados</Text>
                            :
                            constactsList
                }
            </ScrollView>
            <Toast 
                ref={(toast) => setToast(toast)}
                opacity={0.9}
                style={{ backgroundColor: spanishVioletLight, width: width - 30 }}
                textStyle={{ color: '#fff' }}
            />
            <CustomFooter navigate={navigation.navigate} page='Contacts' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    buttonAdd: { 
        width: '50%',
        marginTop: 5, 
        backgroundColor: spanishVioletLight, 
        alignSelf: 'flex-end', 
        marginRight: 15 
    }
})
