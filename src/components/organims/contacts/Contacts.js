import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, Alert, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import Contact from '../../molecules/contact/Contact';
import ContactForm from '../contact-form/ContactForm';
import { MaterialIcons } from '@expo/vector-icons';
import { firestorem, getNewId } from '../../../utils/firebase';
import colors from '../../../utils/colors';
const { spanishVioletLight } = colors;

export default function Contacts({ user }) {

    const initialStateContact = {
        id: 0,
        name: '',
        phone: ''
    };

    const [contactSelected, setContactSelected] = useState(initialStateContact);
    const [showModal, setShowModal] = useState(false);

    const contacts = user.contacts ?? user.contacts;
   
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
        <ScrollView contentContainerStyle={styles.container}>
            <Button 
                title='Agregar Contacto' 
                onPress={showContactForm}
                icon={ <MaterialIcons name='add' size={30} color='#fff' /> }
                buttonStyle={styles.buttonAdd} />
            <ContactForm
                showModal={showModal}
                setShowModal={setShowModal}
                aceptButton={saveContact}
                />
            { constactsList}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    buttonAdd: { 
        width: '50%',
        marginTop: 5, 
        backgroundColor: spanishVioletLight, 
        alignSelf: 'flex-end', 
        marginRight: 15 
    }
})
