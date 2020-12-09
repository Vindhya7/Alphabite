import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Picker,
  TouchableHighlight,
} from "react-native";
import AppBar from "../components/AppBar.js";
import {
  DataTable,
  IconButton,
  Portal,
  FAB,
  Dialog,
  Button,
} from "react-native-paper";
import firebase from "firebase";
import Swipeable from "react-native-swipeable-row";
import { NavigationEvents } from "react-navigation";

class NutritionSelectionScreen extends React.Component {
  static navigationOptions = {
    title: "Remove from Inventory",
    headerStyle: { backgroundColor: "#95db93" },
    headerTitleStyle: { color: "#000a13" },
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      sortDirection: "ascending",
      sortBy: 0,
      uid: "",
      setEditedItem: 0,
      confirmDisabled: true,
    };

    refs = {};
  }

  refresh = () => {
    this.componentDidMount();
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({ uid: user.uid });
        firebase
          .database()
          .ref("users/" + user.uid + "/inventory")
          .once("value")
          .then((snapshot) => {
            if (snapshot.val()) {
              const newData = Object.keys(snapshot.val()).reduce(
                (arr, item) => [
                  ...arr,
                  {
                    key: item,
                    capacity: snapshot.val()[item].quantity,
                    quantity: 0,
                  },
                ],
                []
              );

              this.setState({ data: newData });
            }
          });
      }
    });
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
    this.refresh();
  }

  handleNavigationOut() {
    this.setState({ fabVisible: false });
  }

  handleDialog = (idx) => {
    this.setState({ setEditedItem: idx });
    this.setState({ isDialogVisible: true });
  };

  setDialogVisible = (bool) => {
    this.setState({ isDialogVisible: bool });
  };

  addOne = (idx) => {
    var obj = this.state.data[idx];
    obj.quantity = Number(obj.quantity) + 1;
    if (obj.quantity > obj.capacity) obj.quantity = obj.capacity;
    var newData = this.state.data;
    newData[idx] = obj;

    this.setState({ data: newData });

    const comp = newData.map((item) => {
      let quantity = item.quantity;
      if (quantity == 0) {
        return 1;
      } else {
        return 0;
      }
    });

    var len = comp.filter((x) => x === 1);

    if (len.length === newData.length) {
      this.setState({ confirmDisabled: true });
    } else {
      this.setState({ confirmDisabled: false });
    }
  };

  minusOne = (idx) => {
    var obj = this.state.data[idx];
    obj.quantity = Number(obj.quantity) - 1;
    if (obj.quantity < 0) obj.quantity = 0;

    // if (obj.quantity == 0) {
    //   firebase
    //     .database()
    //     .ref("users/" + this.state.uid + "/inventory/" + obj.key)
    //     .set(null);
    // } else {
    //   firebase
    //     .database()
    //     .ref("users/" + this.state.uid + "/inventory/" + obj.key)
    //     .update({
    //       quantity: obj.quantity,
    //     });
    // }

    var newData = this.state.data;
    newData[idx] = obj;

    this.setState({ data: newData });

    const comp = newData.map((item) => {
      let quantity = item.quantity;
      if (quantity == 0) {
        return 1;
      } else {
        return 0;
      }
    });

    var len = comp.filter((x) => x === 1);

    if (len.length === newData.length) {
      this.setState({ confirmDisabled: true });
    } else {
      this.setState({ confirmDisabled: false });
    }
  };

  confirmSelection() {
    var data = this.state.data;

    data.map((obj) => {
      var left = obj.capacity - obj.quantity;
      if (left == 0) {
        firebase
          .database()
          .ref("users/" + this.state.uid + "/inventory/" + obj.key)
          .set(null);
      } else {
        firebase
          .database()
          .ref("users/" + this.state.uid + "/inventory/" + obj.key)
          .update({
            quantity: left,
          });
      }
    });

    this.props.navigation.popToTop();
  }

  sortByFood() {
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
        if (a.key < b.key) return -1;
        if (a.key > b.key) return 1;
        return 0;
      });
    } else {
      arr.sort((a, b) => {
        if (a.key < b.key) return 1;
        if (a.key > b.key) return -1;
        return 0;
      });
    }

    this.setState({ data: arr });
    this.setState({ sortBy: 0 });
  }

  sortByCapacity() {
    if (this.state.sortBy == 1) {
      if (this.state.sortDirection == "ascending") {
        this.setState({ sortDirection: "descending" });
      } else {
        this.setState({ sortDirection: "ascending" });
      }
    }

    var arr = this.state.data;

    if (this.state.sortDirection == "ascending") {
      arr.sort((a, b) => {
        if (a.capacity < b.capacity) return -1;
        if (a.capacity > b.capacity) return 1;
        return 0;
      });
    } else {
      arr.sort((a, b) => {
        if (a.capacity < b.capacity) return 1;
        if (a.capacity > b.capacity) return -1;
        return 0;
      });
    }

    this.setState({ data: arr });
    this.setState({ sortBy: 1 });
  }

  addTableRows() {
    return this.state.data.map((item, idx) => {
      return (
        <DataTable.Row style={styles.dataItem} key={idx}>
          <DataTable.Cell style={{}}>
            <Text style={{ color: "#000a13" }}>{item.key}</Text>
          </DataTable.Cell>

          <DataTable.Cell numeric>
            <View style={styles.dataCell}>
              <Text style={{ color: "#000a13" }}>{item.capacity}</Text>
            </View>
          </DataTable.Cell>

          <DataTable.Cell numeric>
            <View style={styles.dataCell}>
              <IconButton
                icon="minus-circle-outline"
                onPress={() => this.minusOne(idx)}
              />
              <Text style={{ color: "#000a13" }}>{item.quantity}</Text>
              <IconButton
                icon="plus-circle-outline"
                onPress={() => this.addOne(idx)}
              />
            </View>
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
                this.sortByFood();
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Food</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title style={{ paddingRight: 25 }} numeric>
            <TouchableOpacity onPress={() => this.sortByCapacity()}>
              <Text style={{ fontWeight: "bold" }}>Capacity</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title style={{ paddingRight: 25 }} numeric>
            <Text style={{ fontWeight: "bold" }}>Quantity</Text>
          </DataTable.Title>
        </DataTable.Header>
      );
    } else {
      header = (
        <DataTable.Header style={styles.dataHeader}>
          <DataTable.Title>
            <TouchableOpacity
              onPress={() => {
                this.sortByFood();
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Food</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title
            style={{ paddingRight: 25 }}
            sortDirection={this.state.sortDirection}
            numeric
          >
            <TouchableOpacity onPress={() => this.sortByCapacity()}>
              <Text style={{ fontWeight: "bold" }}>Capacity</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title style={{ paddingRight: 25 }} numeric>
            <Text style={{ fontWeight: "bold" }}>Quantity</Text>
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

        <ScrollView
          onScroll={() => {
            this.handleScrollStart();
          }}
          onMomentumScrollEnd={() => this.handleScrollEnd()}
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
          <FAB
            style={styles.fab}
            medium
            label="Confirm"
            disabled={this.state.confirmDisabled}
            onPress={() => this.confirmSelection()}
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
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default NutritionSelectionScreen;
