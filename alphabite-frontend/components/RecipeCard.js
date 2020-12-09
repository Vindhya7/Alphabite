import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  TouchableRipple,
} from "react-native-paper";
import * as Font from 'expo-font';
import { AppLoading } from 'expo';


let customFonts = {
  'Montserrat': require('../assets/fonts/Montserrat-Regular.ttf'),
  'Montserrat-bold': require('../assets/fonts/Montserrat-SemiBold.ttf')
};

class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      fontsLoaded: false,
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount(){
    this._loadFontsAsync();
  }

  handleClick(){
    console.log("clicked");
    this.props.nav.navigate("Recipe", {
      id: this.props.id,
    });
  }
  
  render() {
    if (this.state.fontsLoaded) {
      return (
        <TouchableOpacity onPress={() => this.handleClick()}>
          <Card style={styles.card}>
            <Card.Cover
              style={{ borderRadius: 10 }}
              source={{ uri: this.props.image }}
            />
            <Card.Content>
              <Title style={{ fontSize: 15, color: "#000a13", fontFamily: 'Montserrat-bold' }}>
                {this.props.title}
              </Title>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }else{
      return <AppLoading />;
    }
  }
}
const styles = StyleSheet.create({
  card: {
    height:260,
    borderRadius:10,
  }
});

export default RecipeCard;
