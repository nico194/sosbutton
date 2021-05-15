import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Alert, ScrollView } from 'react-native';
import { Button, Text } from 'react-native-elements';
import FAB from '../components/atom/fab/FAB';
import Contact from '../components/molecules/contact/Contact';
import CustomHeader from '../components/molecules/header/CustomHeader';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import ContactForm from '../components/organims/contact-form/ContactForm';
import { MaterialIcons } from '@expo/vector-icons';
import { firestore, getNewId } from '../utils/firebase';
import colors from '../utils/colors';
const { spanishVioletLight } = colors;

export default function ContactsScreen({ navigation }) {

    const initialStateContact = {
        id: 0,
        name: '',
        phone: ''
    };

    const [contactSelected, setContactSelected] = useState(initialStateContact);
    const [showModal, setShowModal] = useState(false);

    const contacts = [] //user.contacts ?? user.contacts;
   
    const constactsList = contacts && contacts.map((contact, index) => {
        return (
            <Contact
                key={index}
                contact={contact}
                contactSelected={contactSelected}
                setContactSelected={setContactSelected}
            />
        )
    });

    const showContactForm = () => {
        setShowModal(!showModal);
    }

    const saveContact = async () => {
        console.log('click')
        // setLoading(true);
        // try {
        //     const contact = { id: getNewId() , name, phone };
        //     contacts.push(contact)
        //     await firestore.collection('users').doc(user.id).set({ ...user, contacts});
        //     setLoading(false)
        //     setShowModal(false)
        // } catch (error) {
        //     console.log(error);
        //     setLoading(false)
        // }
    }

    // const openContactCard = contact => {
    //     if (selected !== contact.id) {
    //         setName(contact.name);
    //         setPhone(contact.phone);
    //         setSelected(contact.id)
    //     } else {
    //         setName('');
    //         setPhone('');
    //         setSelected(-1)
    //     }
    // }

    // const openDeleteAlert = id => {
    //     Alert.alert(
    //         'Eliminar Contacto',
    //         'Esta seguro que desea eliminar el contacto?',
    //         [
    //             {
    //                 text: "Cancelar",
    //                 onPress: () => {},
    //                 style: "cancel"
    //             },
    //             {
    //                 text: 'Aceptar',
    //                 onPress: () => removeContact(id),
    //             }
    //         ],
    //         { cancelable: false }
    //     )
    // }

    // const removeContact = async (id) => {
    //     setLoading(true)
    //     try {
    //         const contactsDeleted = contacts.filter( contact => contact.id !== id )
    //         setContacts(contactsDeleted);
    //         await firebase.firestore().collection('users').doc(user.id).set({ ...user, contacts: contactsDeleted});
    //         setLoading(false);
    //     } catch (error) {
    //         console.log(error)
    //         setLoading(false);
    //     }
    // }

    // const updateContact = async (id) => {
    //     setLoading(true)
    //     try {
    //         const contactsUpdated = contacts.map( contact => contact.id === id ? { ...contact, name, phone } : contact )
    //         setContacts(contactsUpdated);
    //         await firebase.firestore().collection('users').doc(user.id).set({ ...user, contacts: contactsUpdated});
    //         setLoading(false);
    //     } catch (error) {
    //         console.log(error)
    //         setLoading(false);
    //     }
    // }

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
                <Text h4 h4Style={{ padding: 15 }}>Contactos</Text>
                <ContactForm
                    showModal={showModal}
                    setShowModal={setShowModal}
                    aceptButton={saveContact}
                    />
                { constactsList}
            </ScrollView>
            <CustomFooter navigation={navigation} page='Contacts' />
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
