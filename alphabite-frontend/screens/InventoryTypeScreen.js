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
import firebase from "firebase";



class InventoryTypeScreen extends React.Component{

    constructor(props){
        super(props);
        this.state = { uid: '', itemName: '', expiryDate: '', quantity: '' };

    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                this.setState({uid: user.uid});
            }
        })
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
        firebase
            .database()
            .ref('users/' + this.state.uid + '/inventory/')
            .once('value')
            .then((snapshot) => {
                var vals = snapshot.val();
                var updateKey = this.state.itemName.toLowerCase();
                var updateVal = this.state.quantity;

                if(updateKey in vals){
                    var q = vals[this.state.itemName.toLowerCase()];
                    updateVal  = Number(q) + Number(this.state.quantity);
                }

                firebase
                    .database()
                    .ref('users/' + this.state.uid + '/inventory/')
                    .update({
                        [updateKey]: updateVal
                    })

                this.props.navigation.goBack();
            }).catch((error) => {
                console.log(error);
        });



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
                        value={this.state.itemName}
                        onChangeText={itemName => this.setState({ itemName })}
                    />
                </View>

                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Expiry Date"
                        placeholderTextColor="#000a13"
                        returnKeyType="next"
                        textContentType="name"
                        value={this.state.expiryDate}
                        onChangeText={expiryDate => this.setState({ expiryDate })}
                    />
                </View>
                <View style={styles.inputView} >
                    <TextInput
                        style={styles.inputText}
                        placeholder="Quantity"
                        placeholderTextColor="#000a13"
                        returnKeyType="next"
                        textContentType="name"
                        value={this.quantity}
                        onChangeText={quantity => this.setState({ quantity })}
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
