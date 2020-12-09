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
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

class InventoryScreen extends React.Component {
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
      duration: "set",
      setEditedItem: 0,
      durationColor: true,
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
                    quantity: snapshot.val()[item].quantity,
                    reminder: snapshot.val()[item].reminder,
                    remID: null,
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

  setReminder = async (idx) => {
    var rem = this.state.duration;
    var obj = this.state.data[idx];

    if(obj.remID){
      await Notifications.cancelScheduledNotificationAsync(obj.remID);
    }

    obj.reminder = rem;
    
    firebase
      .database()
      .ref("users/" + this.state.uid + "/inventory/" + obj.key)
      .update({
        reminder: rem,
      });
    var newData = this.state.data;
    newData[idx] = obj;

    this.setState({ data: newData });

    var remTimes = {
      "1week": 60 * 60 * 24 * 7 * 1000,
      "2weeks": 2 * 60 * 60 * 24 * 7 * 1000,
      "1month": 60 * 60 * 24 * 30 * 1000,
      "2months": 2 * 60 * 60 * 24 * 30 * 1000,
      "6months": 6 * 60 * 60 * 24 * 30 * 1000,
      "12months": 12 * 60 * 60 * 24 * 30 * 1000,
    };

    await this.schedulePushNotification(remTimes[rem], idx);
  };

  schedulePushNotification = async (val, idx) => {
    const t = new Date(Date.now() + val);
    t.setMinutes(0);
    t.setSeconds(0);
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Eat",
        body: "Something in your inventory is expiring!",
      },
      trigger: { seconds: 60 },
    });
    
    var obj = this.state.data[idx];
    obj.remID = id;
    var newData = this.state.data;
    newData[idx] = obj;

    this.setState({ data: newData });

  }

  addOne = (idx) => {
    var obj = this.state.data[idx];
    obj.quantity = Number(obj.quantity) + 1;

    firebase
      .database()
      .ref("users/" + this.state.uid + "/inventory/" + obj.key)
      .update({
        quantity: obj.quantity,
      });

    var newData = this.state.data;
    newData[idx] = obj;

    this.setState({ data: newData });
  };

  minusOne = (idx) => {
    var obj = this.state.data[idx];
    obj.quantity = Number(obj.quantity) - 1;
    if (obj.quantity < 0) obj.quantity = 0;

    if (obj.quantity == 0) {
      firebase
        .database()
        .ref("users/" + this.state.uid + "/inventory/" + obj.key)
        .set(null);
    } else {
      firebase
        .database()
        .ref("users/" + this.state.uid + "/inventory/" + obj.key)
        .update({
          quantity: obj.quantity,
        });
    }

    var newData = this.state.data;
    if (obj.quantity == 0) {
      newData.splice(idx, 1);
    } else {
      newData[idx] = obj;
    }

    this.setState({ data: newData });
  };

  deleteItem(idx) {
    refs[idx].current.recenter();
    delete refs[idx];
    var obj = this.state.data[idx];
    obj.quantity = 1;
    var newData = this.state.data;
    newData[idx] = obj;
    this.setState({ data: newData });
    this.minusOne(idx);
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

  sortByQuantity() {
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
        if (a.quantity < b.quantity) return -1;
        if (a.quantity > b.quantity) return 1;
        return 0;
      });
    } else {
      arr.sort((a, b) => {
        if (a.quantity < b.quantity) return 1;
        if (a.quantity > b.quantity) return -1;
        return 0;
      });
    }

    this.setState({ data: arr });
    this.setState({ sortBy: 1 });
  }

  sortByReminder() {
    if (this.state.sortBy == 2) {
      if (this.state.sortDirection == "ascending") {
        this.setState({ sortDirection: "descending" });
      } else {
        this.setState({ sortDirection: "ascending" });
      }
    }

    var arr = this.state.data;

    if (this.state.sortDirection == "ascending") {
      arr.sort((a, b) => {
        var sortedArr = [
          "set",
          "1week",
          "2weeks",
          "1month",
          "2months",
          "6months",
          "12months",
        ];
        return sortedArr.indexOf(a.reminder) - sortedArr.indexOf(b.reminder);
      });
    } else {
      arr.sort((a, b) => {
        var sortedArr = [
          "set",
          "1week",
          "2weeks",
          "1month",
          "2months",
          "6months",
          "12months",
        ];
        return sortedArr.indexOf(b.reminder) - sortedArr.indexOf(a.reminder);
      });
    }

    this.setState({ data: arr });
    this.setState({ sortBy: 2 });
  }

  addTableRows() {
    return this.state.data.map((item, idx) => {
      const rightButtons = [
        <TouchableHighlight style={{ backgroundColor: "red" }}>
          <IconButton
            icon="delete-outline"
            onPress={() => this.deleteItem(idx)}
          />
        </TouchableHighlight>,
      ];

      if (!refs[idx]) {
        refs[idx] = React.createRef();
      }

      var row = (
        <DataTable.Row style={styles.dataItem}>
          <DataTable.Cell style={{}}>
            <Text style={{ color: "#000a13" }}>{item.key}</Text>
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

          <DataTable.Cell style={{ justifyContent: "flex-end" }}>
            <TouchableOpacity onPress={() => this.handleDialog(idx)}>
              <Text
                style={
                  item.reminder.localeCompare("set") ? styles.noSet : styles.set
                }
              >
                {" "}
                {item.reminder}{" "}
              </Text>
            </TouchableOpacity>
          </DataTable.Cell>
        </DataTable.Row>
      );

      return (
        <Swipeable rightButtons={rightButtons} ref={refs[idx]} key={idx}>
          {row}
        </Swipeable>
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
            <TouchableOpacity onPress={() => this.sortByQuantity()}>
              <Text style={{ fontWeight: "bold" }}>Quantity</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title style={{}} numeric>
            <TouchableOpacity onPress={() => this.sortByReminder()}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>Reminder</Text>
            </TouchableOpacity>
          </DataTable.Title>
        </DataTable.Header>
      );
    } else if (this.state.sortBy == 1) {
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
            <TouchableOpacity onPress={() => this.sortByQuantity()}>
              <Text style={{ fontWeight: "bold" }}>Quantity</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title style={{}} numeric>
            <TouchableOpacity onPress={() => this.sortByReminder()}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>Reminder</Text>
            </TouchableOpacity>
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

          <DataTable.Title style={{ paddingRight: 25 }} numeric>
            <TouchableOpacity onPress={() => this.sortByQuantity()}>
              <Text style={{ fontWeight: "bold" }}>Quantity</Text>
            </TouchableOpacity>
          </DataTable.Title>

          <DataTable.Title
            style={{}}
            numeric
            sortDirection={this.state.sortDirection}
          >
            <TouchableOpacity onPress={() => this.sortByReminder()}>
              <Text style={{ fontWeight: "bold", fontSize: 14 }}>Reminder</Text>
            </TouchableOpacity>
          </DataTable.Title>
        </DataTable.Header>
      );
    }

    var dialogInput = (
      <Picker
        selectedValue={this.state.duration}
        onValueChange={(itemValue, itemIndex) => {
          this.setState({ duration: itemValue });
        }}
      >
        <Picker.Item label="Set Duration" value="set" />
        <Picker.Item label="1 Week" value="1week" />
        <Picker.Item label="2 Weeks" value="2weeks" />
        <Picker.Item label="1 Month" value="1month" />
        <Picker.Item label="2 Months" value="2months" />
        <Picker.Item label="6 Months" value="6months" />
        <Picker.Item label="A year" value="12months" />
      </Picker>
    );

    return (
      <SafeAreaView style={styles.container}>
        <NavigationEvents
          onDidFocus={() => this.handleNavigationIn()}
          onDidBlur={() => this.handleNavigationOut()}
        />
        <Portal>
          <Dialog
            visible={this.state.isDialogVisible}
            onDismiss={() => this.setDialogVisible(false)}
          >
            <View style={{ backgroundColor: "#FFFFFF" }}>
              <Dialog.Title style={{ color: "#000a13" }}>
                Remind me after?
              </Dialog.Title>
              <Dialog.Content>{dialogInput}</Dialog.Content>
              <Dialog.Actions>
                <Button onPress={() => this.setDialogVisible(false)}>
                  Cancel
                </Button>
                <Button
                  onPress={() => {
                    this.setDialogVisible(false);
                    this.setReminder(this.state.setEditedItem);
                  }}
                >
                  Ok
                </Button>
              </Dialog.Actions>
            </View>
          </Dialog>
        </Portal>

        <AppBar navigation={this.props.navigation} title="Inventory" />
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
          <FAB.Group
            open={this.state.fabOpen}
            icon={this.state.fabOpen ? "close" : "plus"}
            visible={this.state.fabVisible}
            actions={[
              {
                icon: "camera",
                label: "Take Picture",
                onPress: () => {
                  // this.setState({ fabVisible: false });
                  this.props.navigation.navigate("Scan", {
                    refresh: this.refresh,
                    uid: this.state.uid,
                    parentProp: this.props,
                  });
                },
              },
              {
                icon: "pencil",
                label: "Type",
                onPress: () => {
                  // this.setState({ fabVisible: false });
                  this.props.navigation.navigate("Type", {
                    refresh: this.refresh,
                  });
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

export default InventoryScreen;
