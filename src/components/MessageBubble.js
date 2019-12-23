import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewPropTypes,
  Platform,
  Image,
  Dimensions,
  Linking
} from 'react-native';

// import NativeSyntaxHighlighter from '../components/HighLighter';
// import Markdown from 'react-native-markdown-package';
import Markdown from 'react-native-markdown-renderer';
import MapView from 'react-native-maps'

import { Avatar ,MessageText, MessageImage, Time, utils, } from 'react-native-gifted-chat';

const { isSameUser, isSameDay } = utils;

export default class Bubble extends React.Component {

  constructor(props) {
    super(props);
    this.onLongPress = this.onLongPress.bind(this);
  }

  onLongPress() {
    if (this.props.onLongPress) {
      this.props.onLongPress(this.context, this.props.currentMessage);
    } else {
      if (this.props.currentMessage.text) {
        const options = [
          'Copy Text',
          'Cancel',
        ];
        const cancelButtonIndex = options.length - 1;
        // this.context
        this.context.actionSheet().showActionSheetWithOptions({
          options,
          cancelButtonIndex,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              Clipboard.setString(this.props.currentMessage.text);
              break;
          }
        });
      }
    }
  }

  renderMessageText() {
    // console.log(this.props.currentMessage);
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;

      let deletedStyle = { fontFamily: 'RobotoMono-Italic', color: 'white', fontSize: 12 };

      if(this.props.currentMessage.messageType !== 'deleted') {
         deletedStyle = {}
      } 
      
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      
      return this.props.currentMessage.messageType === 'text' ?         
          (
          <Markdown
            style={markdownStyle}
          >
            { this.props.currentMessage.text } 
          </Markdown>
        ) :             
        (<MessageText
              {...messageTextProps}
              textStyle={{
                left: {...styles.standardFont, ...styles.slackMessageText, ...messageTextProps.textStyle, ...messageTextStyle, ...deletedStyle},
              }}
          />)
     }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps}  />;
    }
    return null;
  }

  renderTicks() {
    const { currentMessage } = this.props;
    if (this.props.renderTicks) {
      return this.props.renderTicks(currentMessage);
    }
    if (currentMessage.user._id !== this.props.user._id) {
      return null;
    }
    if (currentMessage.sent || currentMessage.received) {
      return (
        <View style={[styles.headerItem, styles.tickView]}>
          {currentMessage.sent && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
          {currentMessage.received && <Text style={[styles.standardFont, styles.tick, this.props.tickStyle]}>✓</Text>}
        </View>
      );
    }
    return null;
  }

  renderUsername() {
    const username = this.props.currentMessage.user.name;
    if (username) {
      const { containerStyle, wrapperStyle, ...usernameProps } = this.props;
      if (this.props.renderUsername) {
        return this.props.renderUsername(usernameProps);
      }

      return (
        <View style={{ flexDirection: 'row' }}>
          <Text style={[styles.standardFont, styles.headerItem, styles.username, this.props.usernameStyle]}>
            {username}
          </Text>
        </View>
      );
    }
    return null;
  }

  renderTime() {
    if (this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, ...timeProps } = this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return (
        <Time
          {...timeProps}
          containerStyle={{ left: [styles.timeContainer] }}
          textStyle={{ left: [styles.standardFont, styles.headerItem, styles.time, timeProps.textStyle] }}
        />
      );
    }
    return null;
  }

  renderLocation() {
      if (this.props.currentMessage.location) {
        return (
          <TouchableOpacity
            onPress={this.openMapAsync}
          >
            <MapView
              style={[styles.mapView]}
              region={{
                latitude: this.props.currentMessage.location.latitude,
                longitude: this.props.currentMessage.location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
            />
          </TouchableOpacity>
        )
      }
      return null
    }
  
    openMapAsync = async () => {
      const { currentMessage: { location = {} } = {} } = this.props
  
      const url = Platform.select({
        ios: `http://maps.apple.com/?ll=${location.latitude},${
          location.longitude
        }`,
        default: `http://maps.google.com/?q=${location.latitude},${
          location.longitude
        }`,
      })
  
      try {
        const supported = await Linking.canOpenURL(url)
        if (supported) {
          return Linking.openURL(url)
        }
        alert('Opening the map is not supported.')
      } catch ({ message }) {
        alert(message)
      }
    }

  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }

  render() {
    const isSameThread = isSameUser(this.props.currentMessage, this.props.previousMessage)
      && isSameDay(this.props.currentMessage, this.props.previousMessage);

    const messageHeader = isSameThread ? null : (
      <View style={styles.headerView}>
        {this.renderUsername()}
        {this.renderTime()}
        {this.renderTicks()}
      </View>
    );

    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <TouchableOpacity
          onLongPress={this.onLongPress}
          accessibilityTraits="text"
          {...this.props.touchableProps}
        >
          <View
            style={[
              styles.wrapper,
              this.props.wrapperStyle,
            ]}
          >
            <View>
              {this.renderCustomView()}
              {messageHeader}
              {this.renderMessageImage()}
              {this.renderMessageText()}
              {this.renderLocation()}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

}


// Note: Everything is forced to be "left" positioned with this component.
// The "right" position is only used in the default Bubble.
const styles = StyleSheet.create({
  standardFont: {
    fontSize: 15,
  },
  slackMessageText: {
    marginLeft: 0,
    color: 'white',
    fontSize: 13,
    fontFamily: 'RobotoMono-Regular',
    marginRight: 0,
  },
  container: {
    flex: 1,
    alignItems: 'flex-start',
  },
  wrapper: {
    marginRight: 60,
    minHeight: 20,
    justifyContent: 'flex-end',
  },
  username: {
    color:'white',
    fontWeight: 'bold',
  },
  time: {
    textAlign: 'left',
    fontSize: 12,
  },
  timeContainer: {
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  headerItem: {
    marginRight: 10,
  },
  headerView: {
    // Try to align it better with the avatar on Android.
    marginTop: Platform.OS === 'android' ? -2 : 0,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  /* eslint-disable react-native/no-color-literals */
  tick: {
    backgroundColor: 'transparent',
    color: 'white',
  },
  /* eslint-enable react-native/no-color-literals */
  tickView: {
    flexDirection: 'row',
  },
  slackImage: {
    borderRadius: 3,
    marginLeft: 0,
    marginRight: 0,
  },
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 40,
    width: 40,
    borderRadius: 3,
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    backgroundColor: 'red'
  },
});

const markdownStyle = StyleSheet.create({
  autolink: {
    color: 'blue',
  },
  blockQuoteText: {
    color: 'grey'
  },
  blockQuoteSection: {
    flexDirection: 'row',
  },
  blockQuoteSectionBar: {
    width: 3,
    height: null,
    backgroundColor: '#DDDDDD',
    marginRight: 15,
  },
  bgImage: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bgImageView: {
    flex: 1,
    overflow: 'hidden',
  },
  view: {
    alignSelf: 'stretch',
  },
  codeBlock: {
    fontFamily: 'Courier',
    fontWeight: '500',
  },
  del: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  em: {
    fontStyle: 'italic',
  },
  heading: {
    fontWeight: '200',
  },
  heading1: {
    fontSize: 32,
  },
  heading2: {
    fontSize: 24,
  },
  heading3: {
    fontSize: 18,
  },
  heading4: {
    fontSize: 16,
  },
  heading5: {
    fontSize: 13,
  },
  heading6: {
    fontSize: 11,
  },
  hr: {
    backgroundColor: '#cccccc',
    height: 1,
  },
  image: {
    height: 200, // Image maximum height
    width: Dimensions.get('window').width - 30, // Width based on the window width
    alignSelf: 'center',
    resizeMode: 'contain', // The image will scale uniformly (maintaining aspect ratio)
  },
  imageBox: {
    flex: 1,
    resizeMode: 'cover',
  },
  codeInline: {
    backgroundColor: 'grey',
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    fontFamily: 'RobotoMono-Regular',
    fontSize: 12,
    padding: 7,
    color: 'white'
  },
    codeBlock: {
    fontFamily: 'RobotoMono-Regular',
    backgroundColor: 'grey',
    padding: 20,
    fontSize: 12,
    color: 'white'
  },
  list: {
    backgroundColor: 'red'
  },
  sublist:{
    paddingLeft: 20,
    width: Dimensions.get('window').width - 60,
  },
  listItem: {
    flexDirection: 'row',
  },
  listItemText: {
    flex: 1,
    
  },
  listItemBullet: {
    fontSize: 20,
    lineHeight: 20,
  },
  listItemNumber: {
    fontWeight: 'bold',
  },
  listRow: {
    flexDirection: 'row',
  },
  paragraph: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  paragraphCenter: {
    marginTop: 10,
    marginBottom: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
    textAlign: 'center',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  paragraphWithImage: {
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  noMargin: {
    marginTop: 0,
    marginBottom: 0,
  },
  strong: {
    fontWeight: 'bold',
  },
  table: {
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 3,
  },
  tableHeader: {
    backgroundColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableHeaderCell: {
    color: '#ffffff',
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
    //borderBottomWidth: 1,
    borderColor: '#222222',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tableRowLast: {
    borderColor: 'transparent',
  },
  tableRowCell: {
    padding: 5,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'RobotoMono-Regular'
  },
  textRow: {
    flexDirection: 'row',
  },
  u: {
    borderColor: '#222222',
    borderBottomWidth: 1,
  },
})


