import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { DataTable, IconButton, Portal, FAB } from "react-native-paper";
import firebase from "firebase";
import AppBar from "../components/AppBar.js";
import { NavigationEvents } from "react-navigation";
import createNutritionProfile from "../api/createNutritionProfile";

class NutritionScreen extends React.Component {
  static navigationOptions = {
    headerShown: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sortDirection: "ascending",
      sortBy: 0,
      uid: "",
      fabOpen: false,
      fabVisible: true,
      isDialogVisible: false,
      setEditedItem: 0,
      refs: [],
      refreshing: false,
    };
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({ uid: user.uid });

        firebase
          .database()
          .ref("users/" + user.uid + "/nutrition")
          .once("value")
          .then((snapshot) => {
            const newData = Object.keys(snapshot.val()).reduce(
              (arr, item) => [
                ...arr,
                {
                  nutrient: item,
                  consumed: snapshot.val()[item][0],
                  required: snapshot.val()[item][1],
                },
              ],
              []
            );

            this.setState({ data: newData });
            this.setState({ refreshing: false });
          });
      }
    });
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.componentDidMount();
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  handleScrollStart() {
    this.setState({ fabVisible: false });
  }

  handleScrollEnd() {
    this.setState({ fabVisible: true });
  }

  handleNavigationIn() {
    this.setState({ fabVisible: true });

    this.onRefresh();
  }

  handleNavigationOut() {
    this.setState({ fabVisible: false });
  }

  handleReset() {
    firebase
      .database()
      .ref("users/" + this.state.uid)
      .once("value")
      .then((snapshot) => {
        const { gender, weight, height, age } = snapshot.val();

        const nutritionProfile = createNutritionProfile(
          height,
          weight,
          age,
          gender
        );

        const nutrition = nutritionProfile.reduce(
          (obj, item) => ({ ...obj, [item.nutrient]: item.vals }),
          {}
        );

        firebase
          .database()
          .ref("users/" + this.state.uid)
          .update({
            nutrition: nutrition,
          });

        this.componentDidMount();
      });
  }

  sortByNutrient() {
    if (this.state.sortBy == 0) {
      if (this.state.sortDirection == "ascending") {
        this.setState({ sortDirection: "descending" });
      } else {
        this.setState({ sortDirection: "ascending" });
      }
    }

    var arr = this.state.data;

    if (this.state.sortDirection == "ascending") {
      arr.sort((a, b) => {
        if (a.nutrient < b.nutrient) return -1;
        if (a.nutrient > b.nutrient) return 1;
        return 0;
      });
    } else {
      arr.sort((a, b) => {
        if (a.nutrient < b.nutrient) return 1;
        if (a.nutrient > b.nutrient) return -1;
        return 0;
      });
    }

    this.setState({ data: arr });
    this.setState({ sortBy: 0 });
  }

  sortByConsumption() {
    if (this.state.sortBy == 1) {
      if (this.state.sortDirection == "ascending") {
        this.setState({ sortDirection: "descending" });
      } else {
        this.setState({ sortDirection: "ascending" });
      }
    }
  }

  addRef(idx, ref) {
    var list = this.state.refs;
    list[idx] = ref;
    this.setState({ refs: list });
  }

  addTableRows() {
    return this.state.data.map((item, idx) => {
      // console.log(item)

      return (
        <DataTable.Row style={styles.dataItem} key={idx}>
          <DataTable.Cell style={{}}>
            <Text style={{ color: "#000a13" }}>{item.nutrient}</Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ paddingLeft: 115 }}>
            <Text>{item.consumed}</Text>
          </DataTable.Cell>

          <DataTable.Cell style={{ justifyContent: "flex-end" }}>
            <Text>{item.required}</Text>
          </DataTable.Cell>
        </DataTable.Row>
      );
    });
  }
  render() {
    var header;
    if (this.state.sortBy == 0) {
      header = (
        <DataTable.Header style={styles.dataHeader}>
          <DataTable.Title sortDirection={this.state.sortDirection}>
            <TouchableOpacity
              onPress={() => {
                this.sortByNutrient();
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Nutrient</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title numeric>
            <TouchableOpacity onPress={() => this.sortByConsumption()}>
              <Text style={{ fontWeight: "bold" }}>Consumed</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title numeric>
            <TouchableOpacity onPress={() => this.sortByTotal()}>
              <Text style={{ fontWeight: "bold" }}>Total</Text>
            </TouchableOpacity>
          </DataTable.Title>
        </DataTable.Header>
      );
    } else if (this.state.sortBy == 1) {
      header = (
        <DataTable.Header style={styles.dataHeader}>
          <DataTable.Title sortDirection={this.state.sortDirection}>
            <TouchableOpacity
              onPress={() => {
                this.sortByNutrient();
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Nutrient</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title numeric>
            <TouchableOpacity onPress={() => this.sortByConsumption()}>
              <Text style={{ fontWeight: "bold" }}>Consumed</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title numeric>
            <TouchableOpacity onPress={() => this.sortByTotal()}>
              <Text style={{ fontWeight: "bold" }}>Total</Text>
            </TouchableOpacity>
          </DataTable.Title>
        </DataTable.Header>
      );
    } else {
      header = (
        <DataTable.Header style={styles.dataHeader}>
          <DataTable.Title sortDirection={this.state.sortDirection}>
            <TouchableOpacity
              onPress={() => {
                this.sortByNutrient();
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Nutrient</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title numeric>
            <TouchableOpacity onPress={() => this.sortByConsumption()}>
              <Text style={{ fontWeight: "bold" }}>Consumed</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title numeric>
            <TouchableOpacity onPress={() => this.sortByTotal()}>
              <Text style={{ fontWeight: "bold" }}>Total</Text>
            </TouchableOpacity>
          </DataTable.Title>
        </DataTable.Header>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onDidFocus={() => this.handleNavigationIn()}
          onDidBlur={() => this.handleNavigationOut()}
        />
        <AppBar navigation={this.props.navigation} title="Nutrition Log" />

        <ScrollView
          onScroll={() => {
            this.handleScrollStart();
          }}
          onMomentumScrollEnd={() => this.handleScrollEnd()}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }
        >
          <View style={styles.innerContainer}>
            <View style={styles.bottomContainer}>
              <DataTable style={styles.dataTable}>
                {header}

                {this.addTableRows()}
              </DataTable>
            </View>
          </View>
        </ScrollView>
        <Portal>
          <FAB.Group
            open={this.state.fabOpen}
            icon={this.state.fabOpen ? "close" : "plus"}
            visible={this.state.fabVisible}
            actions={[
              {
                icon: "restart",
                label: "Reset today's values",
                onPress: () => {
                  this.handleReset();
                },
              },
              {
                icon: "plus",
                label: "Inventory",
                onPress: () => {
                  // this.setState({ fabVisible: false });
                  this.props.navigation.navigate("Selection");
                },
              },
              {
                icon: "plus",
                label: "Recipe",
                onPress: () => {
                  // this.setState({ fabVisible: false });
                  this.props.navigation.navigate("Recipe");
                },
              },
            ]}
            onStateChange={() =>
              this.setState({ fabOpen: !this.state.fabOpen })
            }
            onPress={() => {
              if (this.state.fabOpen) {
                this.setState({ fabOpen: false });
              } else {
                this.setState({ fabOpen: true });
              }
            }}
          />
        </Portal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000a13",
  },
  innerContainer: {
    flex: 1,
    alignItems: "stretch",
  },
  bottomContainer: {
    flex: 8,
    alignItems: "stretch",
  },
  dataTable: {},
  dataHeader: {
    height: 70,
    paddingTop: 20,
    backgroundColor: "#95db93",
    fontWeight: "bold",
  },
  dataItem: {
    backgroundColor: "#F7F7F7",
  },
  dataCell: {
    flexDirection: "row",
    alignItems: "center",
  },
  noSet: {
    color: "#000a13",
  },
  set: {
    color: "#ff0000",
    fontWeight: "bold",
  },
});

export default NutritionScreen;
