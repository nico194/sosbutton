import React from 'react'
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import { getErrorMessate } from '../../../utils/manageError';
import colors from '../../../utils/colors';
const { danger, dangerLight } = colors;

export default function ErrorMessage({ error, onPress }) {
    return (
        <Button 
            onPress={onPress}
            buttonStyle={styles.errorText}
            title={getErrorMessate(error.code, error.message)}
            titleStyle={{ color: danger }}
        />
    )
}

const styles = StyleSheet.create({
    errorText: {
        padding: 15,
        borderWidth: 2,
        borderColor: danger,
        backgroundColor: dangerLight,
        color: danger,
        marginBottom: 20
    }
})
