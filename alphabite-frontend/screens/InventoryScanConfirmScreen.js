import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    SafeAreaView,
    Button,
    Image,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    CheckBox, TextInput
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import {DataTable, IconButton} from "react-native-paper";

class InventoryScanConfirmScreen extends React.Component{


    constructor(props){
        super(props);
        this.state = { items: this.props.navigation.state.params.list,
            isSelected: false,
            quantity: 0
        };
    }


    componentDidMount(){
        var items = this.props.navigation.state.params.list;

    }

    static navigationOptions = {
        title: 'Confirm the Items',
        headerStyle: { backgroundColor: '#95db93' },
        headerTitleStyle: { color: '#00a13' },
    };

    handleSelection(item){
        console.log(item);
        this.setState({ isSelected: !this.state.isSelected})
    }

    storeSelectedItem(){

    }

    addTableRows(){
        return this.state.items.map((item) => {
            return (
                <DataTable.Row style={styles.dataItem}>

                    <DataTable.Cell><Text style={{color:'#000a13'}}>{item}</Text></DataTable.Cell>

                    <DataTable.Cell>
                        <View style={styles.inputView} >
                            <TextInput

                                placeholder="Add Quantity"
                                placeholderTextColor={(this.state.quantity) ? '#000a13' : 'red'}
                                returnKeyType="next"
                                textContentType="name"
                                value={this.state.quantity}
                                onChangeText={quantity => this.setState({ quantity: quantity })}
                            />
                        </View>
                    </DataTable.Cell>

                    <DataTable.Cell style={{justifyContent: 'flex-end'}}>
                        <CheckBox
                            value={this.state.isSelected}
                            onValueChange={ () => this.handleSelection(item) }
                            style={styles.checkbox}
                        />
                    </DataTable.Cell>

                </DataTable.Row>
            );
        });
    }



    render(){

        var header = <DataTable.Header style={styles.dataHeader}>


                    </DataTable.Header>;

        return(
            <SafeAreaView style = {styles.container}>

                <ScrollView>
                    <View style={styles.innerContainer}>

                        <View style={styles.bottomContainer}>

                            <DataTable style={styles.dataTable}>
                                {header}

                                {this.addTableRows()}

                            </DataTable>

                            <TouchableOpacity
                                style={styles.loginBtn}
                                onPress={() => this.storeSelectedItem()}>
                                <Text style={styles.loginText}>Confirm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.loginBtn}
                                onPress={() => this.props.navigate.goBack()}>
                                <Text style={styles.loginText}>Retake</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>

            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000a13'
    },
    innerContainer: {
        flex: 1,
        alignItems: 'stretch',
    },
    dataTable: {
        color:"#000a13"
    },
    dataHeader: {
        height:70,
        paddingTop:20,
        backgroundColor: "#000a13",
        fontWeight:'bold',
        justifyContent: "flex-end"
    },
    dataItem:{
        backgroundColor:"#F7F7F7",
    },
    dataCell:{
        flexDirection:'row',
        alignItems:'center',
    },
    inputView: {
        justifyContent:'center'
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#71ceac",
        borderRadius:25,
        height:50,
        alignSelf:"center",
        alignItems: "center",
        marginTop:20,

    },
    loginText:{
        color:"#000a13",
        fontWeight: 'bold',
        marginTop: 15,
    },
    iconNotSelected:{

        borderRadius: 85,

    },
    iconSelected:{
        backgroundColor: '#71ceac',
        borderRadius: 85,

    },
    checkbox: {
        alignSelf: "center",
    },
    notZero: {
        color:"#000a13",
    },
    zero: {
        color: "red"
    }

});

export default InventoryScanConfirmScreen;
