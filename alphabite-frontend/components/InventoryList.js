import React from 'react';
import { FlatList, StyleSheet, Text, View ,Button, TouchableOpacity} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 

class InventoryList extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={[
                        {key: 'Milk',value:'10'},
                        {key: 'Butter',value:'20'},
                        {key: 'Tomato',value:'30'},
                        {key: 'Potato',value:'10'},
                        {key: 'Onion',value:'10'},
                        {key: 'Dal',value:'20'},
                        {key: 'Sugar',value:'30'},
                        {key: 'Eggs',value:'10'},
                        {key: 'Bread',value:'20'},
                        {key: 'Avocado',value:'30'},
                        {key: 'Milk',value:'10'},
                        {key: 'Butter',value:'20'},
                        {key: 'Tomato',value:'30'},
                        {key: 'Potato',value:'10'},
                        {key: 'Onion',value:'10'},
                        {key: 'Dal',value:'20'},
                        {key: 'Sugar',value:'30'},
                        {key: 'Eggs',value:'10'},
                        {key: 'Bread',value:'20'},
                        {key: 'Avocado',value:'30'},
                        {key: 'Milk',value:'10'},
                        {key: 'Butter',value:'20'},
                        {key: 'Tomato',value:'30'},
                        {key: 'Potato',value:'10'},
                        {key: 'Onion',value:'10'},
                        {key: 'Dal',value:'20'},
                        {key: 'Sugar',value:'30'},
                        {key: 'Eggs',value:'10'},
                        {key: 'Bread',value:'20'},
                        {key: 'Avocado',value:'30'},
                    ]}
                    renderItem={({item}) => 
                        <View style={styles.item}>
                            <Text style={{ justifyContent: 'flex-start', fontSize:18}}>{item.key}</Text>
                            
                            
                            <View style={{flex:1, justifyContent: 'flex-end', alignItems: 'flex-start', flexDirection: 'row'}}>
                                    <TouchableOpacity>
                                        <AntDesign name="minuscircle" size={24} color="red" />
                                    </TouchableOpacity>
                                    <Text style={{fontSize:18, paddingLeft:20,paddingRight:20}}>{item.value}</Text>
                                    <TouchableOpacity>
                                        <AntDesign name="pluscircle" size={24} color="green" />   
                                    </TouchableOpacity> 
                                
                            </View>
                        </View>
                    }
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        padding: 10,
        height: 50,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },

})

export default InventoryList;