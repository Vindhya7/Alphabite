import React from "react";
import Timeline from 'react-native-timeline-flatlist'
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Picker,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import firebase from "firebase";
import AppBar from "../components/AppBar.js";
import { FontAwesome5 } from '@expo/vector-icons';
import { Portal, Dialog, TextInput, Button, List } from "react-native-paper";


class RewardScreen extends React.Component {

    constructor(props) {
        super(props);
    
        this.state = {
          reward: [
          {time: '100', title: 'Created User Profile', description: ''},
          {time: '100', title: 'Added 5 items in Inventory Log', description: ''},
          {time: '100', title: 'Added 2 days of Nutrition Log', description: ''},
          {time: '100', title: 'Added 3 days of Nutrition Log', description: ''}
        ],
        };
      }

    render(){
      var totalR;
      if(this.state.reward == ""){
        totalR = <Text style={{color:"#000a13", fontSize: 20,textAlign:'center'}}>{this.state.totalreward} points</Text>
      }else{
        var total = 0;
        for (let k in this.state.reward) {
            
            total = total + parseInt(this.state.reward[k].time)
        }
        totalR=<Text style={{color:"#000a13", fontSize: 20, textAlign:'center'}}>{total} points</Text>
      }
        return(
            <SafeAreaView style={styles.container}>
                <AppBar navigation={this.props.navigation} title="Rewards" />
                    <ScrollView>
                     <View style={{backgroundColor:"white", flexDirection:'row', borderRadius:20, height: 30, width: 130, margin:40}}>
                        <FontAwesome5 name="coins" size={20} color="#000a13" style={{margin:4}} />
                        {totalR}
                      </View>
                    <Timeline circleSize={20}
                              circleColor='#71ceac'
                              lineColor='white'
                              timeContainerStyle={{minWidth:52}}
                              timeStyle={{textAlign: 'center', backgroundColor:'yellow', color:'#000a13', padding:5, borderRadius:13}}
                              titleStyle={{color:'white'}}
                              descriptionStyle={{color:'white',marginTop:0}}
                              options={{
                                style:{marginLeft:20}
                              }}
                              data={this.state.reward}
                    />
                    </ScrollView>
            </SafeAreaView>
            
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000a13",
  },
  topContainer: {
    alignItems: "center",
    backgroundColor: "#95db93",
    marginBottom: 10,
    paddingTop: 30,
  },
  userImage: {
    borderColor: "#000a13",
    borderRadius: 85,
    borderWidth: 5,
    height: 170,
    marginBottom: 15,
    width: 170,
  },
  separator: {
    borderBottomColor: "#71ceac",
    borderBottomWidth: 1,
    width: "65%",
    alignSelf: "center",
  },
});

  export default RewardScreen;
  