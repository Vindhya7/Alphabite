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
  
  render() {
    return (
      <Card style ={styles.card} onPress={() => console.log("clicked")}>
        <TouchableOpacity>
          <Card.Content>
            <Title style={{fontSize:15}}>{this.props.title}</Title>
          </Card.Content>
          <Card.Cover style={{width:200, height: 105}} source={{ uri: this.props.image }} />
        </TouchableOpacity>
      </Card>
    );
  }
}
const styles = StyleSheet.create({
  card: {
    width:200,
    height:130,
    margin:50
    
  }
});

export default RecipeCard;
