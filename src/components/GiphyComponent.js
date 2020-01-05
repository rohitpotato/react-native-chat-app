import React from 'react';
import { View, Text, Touchable, FlatList, Image, TextInput, StyleSheet, Button, TouchableOpacity, Dimensions } from 'react-native';

const ScreenHeight = Dimensions.get('window').height;
const ScreenWidth = Dimensions.get('window').width;

const GiphyComponent  = (props) => {

        const { search_results, gifs, onSelectGif, onGifQueryChange, gifQuery } = props;

        return (
            <View style={{ justifyContent: 'flex-end', height: ScreenHeight*0.5, backgroundColor: 'white', borderTopLeftRadius: 17, borderTopRightRadius: 17 }}>
            <View style={styles.container}>
                <View style={styles.input_container}>
                    <TextInput
                    style={styles.text_input}
                    onChangeText={onGifQueryChange}
                    value={gifQuery}
                    placeholder="Search for gifs"
                    />
                </View>
              </View> 
              <FlatList
                data={search_results.length > 0 ? search_results : gifs}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => props.onSelectGif(item.preview_url)}
                    >
                       <View style={{ borderRadius: 50, margin: 20,}}>
                        <Image
                          resizeMode="cover"
                          style={styles.image}
                          source={{uri: item.preview_url}}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => item.id}
                numColumns={3}
                columnWrapperStyle={styles.list}
              />
          </View>
        )
  }

const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    //   padding: 5,
     
    },
    input_container: {
      flex: 2,
      margin: 5
    },
    text_input: {
      height: 35,
      marginTop: 5,
      marginBottom: 10,
      borderRadius: 8,
      borderColor: "#ccc",
      borderWidth: 1,
      marginLeft: 10,
      marginRight: 10
    },
    button_container: {
      flex: 1,
      marginTop: 5
    },
    list: {
      justifyContent: 'space-around'
    },
    image: {
      borderRadius: 80,
      height: ScreenHeight*0.4*0.4,
      width: ScreenWidth*0.3
    }
  });


export default GiphyComponent;