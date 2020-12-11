import React from "react";
import Timeline from "react-native-timeline-flatlist";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Picker,
  ScrollView,
} from "react-native";
import firebase from "firebase";
import AppBar from "../components/AppBar.js";
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationEvents } from "react-navigation";

class RewardScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allRewards: [],
      userRewards: [],
      inventoryCount: 0,
      nutritionCount: 0,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ uid: user.uid });
      

    firebase
      .database()
      .ref("rewards")
      .once("value")
      .then((snapshot) => {
        this.setState({ allRewards: snapshot.val() });
        firebase
          .database()
          .ref("users/" + this.state.uid)
          .once("value")
          .then((snapshot) => {
            this.setState({ userRewards: [] });
            const { inventoryCount, nutritionCount } = snapshot.val();
            this.setState({ inventoryCount: inventoryCount });
            this.setState({ nutritionCount: nutritionCount });
            var rewards = this.state.userRewards;
            rewards.push(this.state.allRewards[0]);
            if (this.state.inventoryCount >= 5)
              rewards.push(this.state.allRewards[1]);
            if (this.state.nutritionCount >= 2)
              rewards.push(this.state.allRewards[2]);
            if (this.state.inventoryCount >= 10)
              rewards.push(this.state.allRewards[3]);
            this.setState({ userRewards: rewards });
          });
      });
      
      });
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  handleNavigationIn() {
    this.componentDidMount();
  }

  render() {
    var total = this.state.userRewards.reduce(
      (acc, reward) => acc + Number(reward.time),
      0
    );

    var totalR = (
      <Text style={{ color: "#000a13", fontSize: 20, textAlign: "center" }}>
        {total} points
      </Text>
    );

    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents onDidFocus={() => this.handleNavigationIn()} />
        <AppBar navigation={this.props.navigation} title="Rewards" />
        <ScrollView>
          <View
            style={{
              backgroundColor: "white",
              flexDirection: "row",
              borderRadius: 20,
              height: 30,
              width: 130,
              margin: 40,
            }}
          >
            <FontAwesome5
              name="coins"
              size={20}
              color="#000a13"
              style={{ margin: 4 }}
            />
            {totalR}
          </View>
          <Timeline
            circleSize={20}
            circleColor="#71ceac"
            lineColor="white"
            timeContainerStyle={{ minWidth: 52 }}
            timeStyle={{
              textAlign: "center",
              backgroundColor: "#ffd700",
              color: "#000a13",
              padding: 5,
              borderRadius: 13,
            }}
            titleStyle={{ color: "white", padding: 20 }}
            descriptionStyle={{ color: "white", marginTop: 0 }}
            options={{
              style: { marginLeft: 20 },
            }}
            data={this.state.userRewards}
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
