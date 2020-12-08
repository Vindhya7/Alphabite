import React from "react";
import { TouchableOpacity } from "react-native";
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
  
  render() {
    return (
      <Card onPress={() => console.log("clicked")}>
        <TouchableOpacity>
          <Card.Content>
            <Title>{this.props.title}</Title>
          </Card.Content>
          <Card.Cover source={{ uri: this.props.image }} />
        </TouchableOpacity>
      </Card>
    );
  }
}

export default RecipeCard;
