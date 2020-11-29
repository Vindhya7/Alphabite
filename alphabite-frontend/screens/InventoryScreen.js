import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Button, Image, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import InventoryList from "../components/InventoryList";
import 'react-native-gesture-handler';
import AppBar from '../components/AppBar.js';
import { DataTable, IconButton } from 'react-native-paper';


class InventoryScreen extends React.Component{

    constructor(props){
      super(props);
      this.state = {
        data: [
                        {key: 'Milk',value:'10'},
                        {key: 'Butter',value:'20'},
                        {key: 'Tomato',value:'30'},
                        {key: 'Potato',value:'10'},
                        {key: 'Onion',value:'10'},
                        {key: 'Dal',value:'20'},
                        {key: 'Sugar',value:'30'},
                        {key: 'Eggs',value:'10'},
                        {key: 'Bread',value:'20'},
                        {key: 'Avocado',value:'30'},
                    ],
        sortDirection: 'ascending',
        sortBy: 0
      }

    }

    addOne = (idx) => {
      var obj = this.state.data[idx];
      obj.value = Number(obj.value) + 1

      var newData = this.state.data;
      newData[idx] = obj;

      this.setState({data: newData});
    }

    minusOne = (idx) => {
      var obj = this.state.data[idx];
      obj.value = Number(obj.value) - 1
      if(obj.value < 0) obj.value = 0

      var newData = this.state.data;
      newData[idx] = obj;

      this.setState({data: newData});
    }

    sortByFood(){

      if(this.state.sortBy == 0) {
        if(this.state.sortDirection == 'ascending'){
          this.setState({sortDirection: 'descending'});
        }
        else{
          this.setState({sortDirection: 'ascending'});
        }
      }

      var arr = this.state.data;

      if(this.state.sortDirection == 'ascending'){
        arr.sort((a, b) => {
          if(a.key < b.key) return -1;
          if(a.key > b.key) return 1;
          return 0;
        });
      }
      else{
        arr.sort((a, b) => {
          if(a.key < b.key) return 1;
          if(a.key > b.key) return -1;
          return 0;
        });
      }

      this.setState({data: arr});
      this.setState({sortBy: 0});
    }

    sortByQuantity(){

      if(this.state.sortBy == 1) {
        if(this.state.sortDirection == 'ascending'){
          this.setState({sortDirection: 'descending'});
        }
        else{
          this.setState({sortDirection: 'ascending'});
        }
      }

      var arr = this.state.data;

      if(this.state.sortDirection == 'ascending'){
        arr.sort((a, b) => {
          if(a.value < b.value) return -1;
          if(a.value > b.value) return 1;
          return 0;
        });
      }
      else{
        arr.sort((a, b) => {
          if(a.value < b.value) return 1;
          if(a.value > b.value) return -1;
          return 0;
        });
      }

      this.setState({data: arr});
      this.setState({sortBy: 1});
    }

    addTableRows(){
      return this.state.data.map((item, idx) => {
        return (
          <DataTable.Row key = {idx}>
            <DataTable.Cell>{item.key}</DataTable.Cell>
            <DataTable.Cell numeric> 
              <IconButton icon="minus-circle" onPress={ () => this.minusOne(idx) }/>
              {item.value}
              <IconButton icon="plus-circle" onPress={ () => this.addOne(idx) }/>
            </DataTable.Cell>
          </DataTable.Row>
        );
      });
    }


    render(){

        var header;
        if(this.state.sortBy == 0){
          header = <DataTable.Header>
                      <DataTable.Title sortDirection={this.state.sortDirection} >
                        <TouchableOpacity onPress = {() => {this.sortByFood()} }><Text>Food</Text></TouchableOpacity>
                      </DataTable.Title>
                    
                      <DataTable.Title numeric >
                        <TouchableOpacity onPress = {() => this.sortByQuantity() }><Text>Quantity</Text></TouchableOpacity>
                      </DataTable.Title>
                  </DataTable.Header>;
        }
        else{
          header = <DataTable.Header>
                      <DataTable.Title>
                        <TouchableOpacity onPress = {() => {this.sortByFood()} }><Text>Food</Text></TouchableOpacity>
                      </DataTable.Title>
                    
                      <DataTable.Title sortDirection={this.state.sortDirection} numeric >
                        <TouchableOpacity onPress = {() => this.sortByQuantity() }><Text>Quantity</Text></TouchableOpacity>
                      </DataTable.Title>
                  </DataTable.Header>;
        }

        return(
            <SafeAreaView style = {styles.container}>
              <AppBar navigation = {this.props.navigation}/>
              <ScrollView>
                <View style={styles.innerContainer}>

                  <View style={styles.topContainer}>
                    <Text style={{color:"#fb5b5a",fontWeight:"bold",fontSize:40}}>Inventory</Text>
                  </View>

                  <View style={styles.bottomContainer}>

                    <DataTable>
                      {header}

                      {this.addTableRows()}

                    </DataTable>

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
    backgroundColor: '#003f5c'
  },
  headerContainer: {
    backgroundColor: '#465881',
    flexDirection: 'row'
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'stretch',
  },
  bottomContainer: {
    flex: 8,
    alignItems: 'stretch',
    backgroundColor: '#465881',
    margin: 10,
  },
  icon: {
    marginLeft: 16,
    marginTop: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});

export default InventoryScreen;
