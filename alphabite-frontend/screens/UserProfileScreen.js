import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';



const styles = StyleSheet.create({
    body: {},
    userImage: {
        borderColor: '#FFF',
        borderRadius: 85,
        borderWidth: 3,
        height: 170,
        marginBottom: 15,
        width: 170,
    },

})


class UserProfileScreen extends React.Component{
    render(){
        return(
            <View>
            <Text>Hi, Vindhya</Text>
            <Image style={styles.userImage}></Image>
            /* separator line

               Age
               Height
               Weight
               Calc BMI
               NutritionCount

                */
                
            </View>
        );
    }
}

export default UserProfileScreen;
