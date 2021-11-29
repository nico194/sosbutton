import React, { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Card, Avatar, Text, Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../../../utils/colors';
const { spanishVioletLight, spanishViolet, danger } = colors;

export default function Contact({ contact, contactSelected, setContactSelected, deleteContact, updateContact }) {

    const { name, phone } = contactSelected;
    const [selected, setSelected] = useState(false)

    const showContactInfo = () => {
        setSelected(!selected);
        setContactSelected(contact)
    }

    const handleChange = (prop, value) => {
        setContactSelected({ ...contactSelected, [prop]: value });
    }

    return (
        <Card containerStyle={[ selected && styles.cardSelected ]}>
            <TouchableOpacity
                onPress={showContactInfo}
                style={styles.contact}
                >
                <View style={styles.name}>
                    <Avatar
                        rounded
                        size={48}
                        icon={
                            {
                                name: 'user-circle',
                                type: 'font-awesome',
                                color: selected ? spanishVioletLight :'#000'
                            }
                        }
                        />
                    <Text h4>{ contact.name }</Text>
                </View>
                <View>
                    {
                        selected ?
                        <MaterialIcons name='expand-less' size={35} color={spanishViolet} />
                        :
                        <MaterialIcons name='expand-more' size={35} color={spanishViolet} />
                    }
                </View>
            </TouchableOpacity>
            {
                selected &&
                    <View>
                        <Input
                            placeholder='Nombre'
                            value={name}
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
                            placeholder='Telefono'
                            keyboardType='numeric'
                            value={phone}
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
                        <View style={styles.actionButtons}>
                            <Button
                                type='clear'
                                title='Elmininar'
                                titleStyle={{ color: danger }}
                                onPress={deleteContact}
                            />
                            <Button
                                title='Guardar'
                                buttonStyle={{ backgroundColor: spanishVioletLight, paddingHorizontal: 30}}
                                onPress={updateContact}
                            />
                        </View>
                    </View>
            }
        </Card>
    )
}

const styles = StyleSheet.create({
    contact: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    name: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    cardSelected: {
        borderWidth: 2,
        borderColor: spanishVioletLight,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})
