import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    CheckBox, TextInput
} from 'react-native';
import { DataTable, Snackbar } from "react-native-paper";
import firebase from "firebase";

class InventoryScanConfirmScreen extends React.Component{


    constructor(props){
        super(props);

        this.state = {
            items: [],
            snackBarIsVisible: false
        };
    }


    componentDidMount(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                this.setState({uid: user.uid});
            }
        })

        var items = this.props.navigation.state.params.list;
        var obj = items.map((item) => {
            return { key: item, quantity: 0, isSelected: false };
        })
        this.setState({items: obj});

    }

    static navigationOptions = {
        title: 'Confirm the Items',
        headerStyle: { backgroundColor: '#95db93' },
        headerTitleStyle: { color: '#000a13' },
    };

    handleSelection(idx){
        var list = this.state.items;
        list[idx].isSelected = (list[idx].isSelected) ? false : true;
        var newList = list;
        this.setState({ items: newList });
    }

    handleQuantityChange(idx, quantity){
        var list = this.state.items;
        list[idx].quantity = quantity;
        var newList = list;
        this.setState({ items: newList });
    }

    storeSelectedItem(){

        const errs = this.state.items.map((item) => {
            if(item.isSelected && item.quantity == 0) return 1;
            else return 0;
        }).filter(x => x == 1);

        const selected = this.state.items.map((item) => {
            if(item.isSelected) return 1;
            else return 0;
        }).filter(x => x == 1);

        if(errs.length != 0 || selected.length == 0){
            this.setState({ snackBarIsVisible: true});
            return;
        }
        else{
            firebase
                .database()
                .ref('users/' + this.state.uid + '/inventory/')
                .once('value')
                .then((snapshot) => {

                    var t1 = this.state.items.map((item) => {
                        if(item.isSelected) return item.key.toLowerCase();
                    });

                    var t2 = this.state.items.map((item) => {
                        if(item.isSelected) return item.quantity.toString();
                    });

                    var foods = t1.filter(x => typeof(x) === 'string');
                    var quants = t2.filter(x => typeof(x) === 'string');

                    var vals = snapshot.val();


                    foods.map((food, idx) => {
                        if(vals && food in vals){
                            var q = vals[food.toLowerCase()];
                            var quant = Number(q.quantity) + Number(quants[idx]);
                            
                            var obj = {quantity: quant, reminder: q.reminder };
                            firebase
                                .database()
                                .ref('users/' + this.state.uid + '/inventory/')
                                .update({
                                    [food] : obj
                                })

                        }
                        else{
                            var obj = { quantity: quants[idx], reminder: 'set' };
                            firebase
                                .database()
                                .ref('users/' + this.state.uid + '/inventory/')
                                .update({
                                    [food]: obj
                                })
                        }
                    });

                    

                }).catch((error) => {
                    console.log(error);
                });

            
            this.props.navigation.popToTop();
        } 
    }

    onDismissSnackBar(){
        this.setState({ snackBarIsVisible: false});
    }

    addTableRows(){
        return this.state.items.map((item, idx) => {
            return (
                <DataTable.Row style={styles.dataItem} key={idx}>

                    <DataTable.Cell><Text style={{color:'#000a13'}}>{item.key}</Text></DataTable.Cell>

                    <DataTable.Cell>
                        <View style={styles.inputView} >
                            <TextInput

                                placeholder="Add Quantity"
                                placeholderTextColor={(item.quantity) ? '#000a13' : 'red'}
                                returnKeyType="next"
                                textContentType="name"
                                value={item.quantity}
                                onChangeText={(quantity) => this.handleQuantityChange(idx, quantity)}
                            />
                        </View>
                    </DataTable.Cell>

                    <DataTable.Cell style={{justifyContent: 'flex-end'}}>
                        <CheckBox
                            value={item.isSelected}
                            onValueChange={ () => this.handleSelection(idx) }
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
                                onPress={() => this.props.navigation.goBack()}>
                                <Text style={styles.loginText}>Retake</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
                <Snackbar
                  visible={this.state.snackBarIsVisible}
                  onDismiss={() => this.onDismissSnackBar()}
                  style={{width:"80%",marginBottom:85,backgroundColor: 'white', alignSelf: 'center', opacity: 0.9}}
                  duration={3000}
                >
                  <Text style={{color: '#000a13', fontSize: 20}}>Please add quantity for selected items.</Text>
                </Snackbar>

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
