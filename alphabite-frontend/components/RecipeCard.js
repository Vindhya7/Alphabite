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

class RecipeCard extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(){
    console.log("clicked");
    this.props.nav.navigate("Recipe", {
      id: this.props.id,
    });
  }
  
  render() {
    return (
      <TouchableOpacity onPress={() => this.handleClick()}>
        <Card style={styles.card}>
          <Card.Cover
            style={{ borderRadius: 10 }}
            source={{ uri: this.props.image }}
          />
          <Card.Content>
            <Title style={{ fontSize: 15, color: "#000a13" }}>
              {this.props.title}
            </Title>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    height:260,
    borderRadius:10,
  }
});

export default RecipeCard;
