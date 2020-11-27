import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';


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


class NutritionScreen extends React.Component{
    render(){
        return(
            <View>
                <TouchableOpacity 
                  style={{alignItems: "flext-start", margin: 16}}
                  onPress={this.props.navigation.openDrawer}>

                  <FontAwesome5 name = "bars" size = {24} color = "#161924" />
                </TouchableOpacity>
                <Text>Hi, Vindhya</Text>
                <Image style={styles.userImage}></Image>
                
            </View>
        );
    }
}

export default NutritionScreen;
