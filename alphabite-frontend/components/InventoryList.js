import React from 'react';
import { FlatList, StyleSheet, Text, View ,Button} from 'react-native';

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
                    ]}
                    renderItem={({item}) => <View style={styles.item}>
                        <Text style={{fontSize:'18'}}>{item.key}</Text>
                        <View style={{flex: 3, flexDirection: 'row'}}>
                            <Button title="+" color="green" style={{padding:"3px"}}></Button>
                            <Text style={{fontSize:'18'}}>{item.value}</Text>
                            <Button title="-" color="red" style={{padding:"3px"}}></Button>
                        </View>
                    </View>}
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
        flex: 2,
        flexDirection: 'row',
        padding: 10,
        height: 44,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
    },

})

export default InventoryList;