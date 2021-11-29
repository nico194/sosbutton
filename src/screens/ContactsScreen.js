import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Dimensions, Alert, ScrollView } from 'react-native';
import { Text } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { Wave } from 'react-native-animated-spinkit';
import Toast from 'react-native-easy-toast';
import FAB from '../components/atom/fab/FAB';
import Contact from '../components/molecules/contact/Contact';
import CustomHeader from '../components/molecules/header/CustomHeader';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import ContactForm from '../components/organims/contact-form/ContactForm';
import colors from '../utils/colors';
import { addContact, deleteContact, updateContact, setChanged } from '../redux/actions/users';
const { spanishVioletLight, spanishViolet } = colors;

const width = Dimensions.get('screen').width;

export default function ContactsScreen({ navigation }) {

    const initialStateContact = {
        id: 0,
        name: '',
        phone: ''
    };

    const [contact, setContact] = useState(initialStateContact);
    const [contactSelected, setContactSelected] = useState(initialStateContact);
    const [showModal, setShowModal] = useState(false);
    const [toast, setToast] = useState(null);

    const dispatch = useDispatch();
    const { loading, contacts, changed } = useSelector(state => state.users)

    const constactsList = contacts !== undefined && contacts.map((cont, index) => {
        return (
            <Contact
                key={index}
                contact={cont}
                contactSelected={contactSelected}
                setContactSelected={setContactSelected}
                deleteContact={() => openDeleteAlert()}
                updateContact={() => dispatch(updateContact(contactSelected))}
            />
        )
    });

    const showContactForm = async () => {
        setShowModal(!showModal);
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
                    onPress: () => dispatch(deleteContact(contactSelected.id))
                }
            ],
            { cancelable: false }
        )
    }


    useEffect(() => {
        if (changed) {
            setShowModal(false)
            dispatch(setChanged())
            toast.show(
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons size= {28} color='#fff' name='done' />
                    <Text style={{ color: '#fff', marginLeft: 10 }}>Lista de contactos actualizada</Text>
                </View>
            )
        } 
    }, [changed, contacts])

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
                    aceptButton={() => dispatch(addContact(contact))}
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
