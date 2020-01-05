import React from 'react'
import { View, Text, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';
import firedatabase from '@react-native-firebase/database';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { Header, SearchBar } from 'react-native-elements';
import ScrollableTabView from 'react-native-scrollable-tab-view';

import UserList from '../components/UserList';
import GroupList from '../components/GroupList';
import CustomTabBar from '../components/CustomTabBar';

class Home extends React.Component {
  state = {
    users: [],
    channels: [],
    unreadObject: {},
    privateTypingObject: {},
    channelTypingObject: {},
    userRef: firestore().collection('users'),
    statusRef: firestore().collection('status'),
    channelRef: firestore().collection('channels'),
    unreadMessagesRef: firestore().collection('unreadMessages'),
    privateTypingRef: firestore().collection('privateTyping'),
    channelTypingRef: firestore().collection('channelTyping'),
    // typingListener: firestore().collection('typing'),
    searchActive: false,
    searchMode: 'users',
    searchQuery: '',
    tabs: {
      0: 'users',
      1: 'channels'
    },
    results: [],
    //userDatabaseRef: firebase().ref('users')
  }

  static navigationOptions = {
    header: null
  }

  componentDidMount() {
      this.getChannels();
      this.getAllUsers();
      this.getUnreadMessageAlert();
      this.getTypingStatus();
      this.markOnlineStatus();
  }

  getTypingStatus = () => {
    this.privateTypingListener = this.state.privateTypingRef.doc(this.props.auth.user.uid).onSnapshot(snap => {
      if(snap.exists) {
        this.setState(prevState => ({
          privateTypingObject: {...prevState.privateTypingObject, ...snap.data()}
        }))
      }
   })

      this.channelTypingListener = this.state.channelTypingRef.onSnapshot(doc => {
        doc.forEach(d => {
          if(d.exists) {
            this.setState(prevState => ({
              channelTypingObject: {...prevState.channelTypingObject, [d.id]: {...d.data()}}
            }))
          }
        })
      })
  }

  getUnreadMessageAlert = () => {
    this.unreadListener = this.state.unreadMessagesRef.doc(this.props.auth.user.uid).onSnapshot(snap => {
      this.setState(prevState => ({
        unreadObject: {...prevState.unreadObject, ...snap.data()}
      }))
    })
  }

  getChannels = () => {
    this.getAllChannels = this.state.channelRef.onSnapshot(querySnapShot => {
      let channels = [];
      querySnapShot.forEach((q) => {
        channels.push({ ...q.data(), uid: q.id })
      })
      this.setState({ channels });
    })
  }

  getAllUsers = () => {
      this.getUsers =  this.state.userRef.onSnapshot(querySnapShot => {
        let users = [];
        querySnapShot.forEach(doc => {
            users.push(doc.data());
        })
        users = users.filter((user) => {
          return user.uid !== this.props.auth.user.uid;
        })
        this.setState({ users });
      })
  }

  markOnlineStatus = () => {
        var uid = firebase.auth().currentUser.uid;

        var userStatusFirestoreRef = firestore().doc('status/' + uid);
        var userStatusDatabaseRef = firedatabase().ref('/status/' + uid);
        // Firestore uses a different server timestamp value, so we'll 
        // create two more constants for Firestore state.

        var isOfflineForDatabase = {
          state: 'offline',
          last_changed: firebase.database.ServerValue.TIMESTAMP,
      };
      
        var isOnlineForDatabase = {
            state: 'online',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

        var isOfflineForFirestore = {
            state: 'offline',
            last_changed: firestore.FieldValue.serverTimestamp(),
        };
        
        var isOnlineForFirestore = {
            state: 'online',
            last_changed: firestore.FieldValue.serverTimestamp(),
        };
        
        firebase.database().ref('.info/connected').on('value', function(snapshot) {
            if (snapshot && snapshot.val() == false) {
                // Instead of simply returning, we'll also set Firestore's state
                // to 'offline'. This ensures that our Firestore cache is aware
                // of the switch to 'offline.'
                userStatusFirestoreRef.set(isOfflineForFirestore);
                return;
            };
        
            userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
                userStatusDatabaseRef.set(isOnlineForDatabase);
        
                // We'll also add Firestore set here for when we come online.
                userStatusFirestoreRef.set(isOnlineForFirestore);
            });
        });
  }

  componentWillUnmount() {
    this.getUsers();
    this.getAllChannels();
    this.unreadListener();
    this.privateTypingListener();
    this.channelTypingListener();
    // this.typingListener();
    firebase.database().ref('.info/connected').off();
  }

  keyExtractor = item => `${item.uid}`;

  keyExtractorChannel = item => `${item.name}`

  renderUsers = ({item}) => {
    return (
      <UserList 
        user={item}
        isTyping={this.state.privateTypingObject[item.uid]}
        unreadCount={this.state.unreadObject[item.uid]}
      />
    )
  }

  renderChannels = ({item}) => {
    return (
      <GroupList 
        isTyping={this.state.channelTypingObject[item.uid]}
        channel={item}
      />
    )
  } 

  onSearchClick = () => {
    this.setState({ searchActive: true });
  }

  onSearchChange = (mode, text) => {
    this.setState({ searchQuery: text }, () => {
      let results = [];
      let items = [...this.state[mode]];
      const regex = new RegExp(text, 'gi');
      results = items.reduce((acc, item) => {
        if(item.name.match(regex)) {
          acc.push(item);
        }
        return acc;
      }, [])
      this.setState({ results });
    })
  }

  render() {
    const {styles:redux, dimensions} = this.props.global;
    const {users, channels, searchActive, searchMode, searchQuery, tabs, results} = this.state;
    return (
    <LinearGradient colors={redux.container.colors} style={{...redux.container,}} >
      <StatusBar hidden/>
      {!searchActive ?  
        <Header
          containerStyle={{ backgroundColor: 'transparent', borderBottomColor: 'transparent', height: dimensions.height * 0.09, marginBottom: dimensions.height*0.02 }} 
          leftComponent={{ icon: 'menu', color: '#fff' }}
          leftContainerStyle={{ justifyContent: 'center' }}
          rightComponent={ 
              <TouchableOpacity 
                onPress={() => this.setState({ searchActive: true })}
              > 
                <MaterialIcons name="search" size={25} color="white"/>  
              </TouchableOpacity> 
                }
          centerComponent={ <Text style={{ fontFamily: 'RobotoMono-Medium', color: 'white', fontSize: 20 }}>Temp Chat</Text> }
        /> : 
        <View style={{ flexDirection: 'row', }}>
            <SearchBar
              containerStyle={{ backgroundColor: 'transparent', borderBottomWidth: 0, flex: 0.8 }}
              // inputContainerStyle={{ borderRadius: 50 }}
              inputStyle={{ color: 'white', fontFamily: 'RobotoMono-Regular', fontSize: 13 }}
              placeholder="Enter Text.."
              onChangeText={(text) => { this.onSearchChange(searchMode, text) }}
              value={searchQuery}
              showCancel
              round
              autoFocus
              // showLoading
          />
         <TouchableOpacity 
            style={{ flex: 0.2, alignSelf: 'center', paddingLEf: 10 }}
            onPress={() => this.setState({ searchActive: false, results })}
          >
          <Text style={{ fontSize: 11, color: 'white', }}>CANCEL</Text>
         </TouchableOpacity>
        </View>
      }

      <ScrollableTabView
        initialPage={0}  
        renderTabBar={()=> <CustomTabBar />} 
        onChangeTab={(tab) => this.setState({ searchMode: tabs[tab.i], results: [], searchActive: false, searchQuery: '' }) }
      >
        <View 
        tabLabel="PEOPLE">
            <FlatList 
                data={results.length ? results : users}
                extraData={this.state}
                renderItem={this.renderUsers}
                keyExtractor={this.keyExtractor}
            />
        </View>
        <View tabLabel="CHANNELS">
            <FlatList 
                data={results.length ? results : channels}
                extraData={this.state}
                renderItem={this.renderChannels}
                keyExtractor={this.keyExtractorChannel}
            />
        </View>
      </ScrollableTabView>

    </LinearGradient >
    )
  }
}

const mapStateToProps = state => ({
  global: state.global,
  auth: state.auth
})

export default connect(mapStateToProps)(Home);