import React from "react";
import { TouchableOpacity } from "react-native";
import { Avatar, Button, Card, Title, Paragraph, TouchableRipple } from 'react-native-paper';


class RecipeCard extends React.Component {
    render(){
        return(
            <Card
                onPress = { () => console.log("clicked")}
            >
                <TouchableOpacity>
                    <Card.Content>
                    <Title>Dosa</Title>
                    </Card.Content>
                    <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
                </TouchableOpacity>
                
            </Card>
        );
    }
}

export default RecipeCard;