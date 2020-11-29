import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Button,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import 'react-native-gesture-handler';



class InventoryTypeScreen extends React.Component{

    constructor(props){
        super(props);
    }

    componentWillUnmount(){
        console.log(this.props.navigation.state);
        this.props.navigation.state.params.refresh();
    }

    static navigationOptions = {
        title: 'Enter the Item details',
        headerStyle: { backgroundColor: '#95db93' },
        headerTitleStyle: { color: '#00a13' },
    };

    addItemInfo() {

    }

    render(){
        return(
            <SafeAreaView style = {styles.container}>

                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Item Name"
                        placeholderTextColor="#000a13"
                        returnKeyType="next"
                        textContentType="name"
                        /*value={}
                        onChangeText={itemName => this.setState({ displayName })}*/
                    />
                </View>

                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Expiry Date"
                        placeholderTextColor="#000a13"
                        returnKeyType="next"
                        textContentType="name"
                        /*value={}
                        onChangeText={itemName => this.setState({ displayName })}*/
                    />
                </View>
                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Quantity"
                        placeholderTextColor="#000a13"
                        returnKeyType="next"
                        textContentType="name"
                        /*value={}
                        onChangeText={itemName => this.setState({ displayName })}*/
                    />
                </View>

                <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() => this.addItemInfo()}>
                    <Text style={styles.loginText}>Confirm</Text>
                </TouchableOpacity>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000a13',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputView:{
        width:"80%",
        backgroundColor:"#F7F7F7",
        borderRadius:25,
        height:65,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    inputText:{
        fontWeight:'bold',
        color:"#000a13",
        width:"100%",
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#71ceac",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:20,
        marginBottom:10
    },
    loginText:{
        color:"#000a13",
        fontWeight: 'bold',
    }
});
export default InventoryTypeScreen;
