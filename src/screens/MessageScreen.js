import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Input, Button, Text } from 'react-native-elements';
import CustomFooter from '../components/molecules/footer/CustomFooter';
import CustomHeader from '../components/molecules/header/CustomHeader';
import colors from '../utils/colors';
const { spanishVioletLight, spanishViolet } = colors;

export default function MessageScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <CustomHeader />
            <Text h3 h3Style={{ padding: 15, color: spanishViolet }}>Mensaje</Text>
            <ScrollView>
                <Card>
                    <Card.Title style={styles.titleStyle}>Mensage de Emergencia</Card.Title>
                    <Input
                        style={styles.messageStyle}
                        multiline={true}
                        numberOfLines={4}
                        placeholder='Ingrese un mensaje predeterinado de pánico'
                    />
                    <Button
                        buttonStyle={styles.saveButton}
                        title='Guardar'
                        onPress={() => console.log('Click')}
                    />
                </Card>
            </ScrollView>
            <CustomFooter navigate={navigation.navigate} page='Message' />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
		flex: 1,
	},
    titleStyle: {
        textAlign: 'left'
    },
    messageStyle: {
        textAlignVertical:'top'
    },
    saveButton: {
        backgroundColor: spanishVioletLight,
        width: '50%',
        alignSelf: 'flex-end'
    }
})
