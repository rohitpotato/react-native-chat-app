import PropTypes from 'prop-types';
import React from 'react';
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
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

import { Avatar ,MessageText, MessageImage, Time, utils } from 'react-native-gifted-chat';

const { isSameUser, isSameDay, Col } = utils;
const DEFAULT_OPTION_TITLES = ['Copy Text', 'Cancel'];

export default class Bubble extends React.Component {

    constructor() {
      super(...arguments);
      this.onLongPress = () => {
          const { currentMessage } = this.props;
          if (this.props.onLongPress) {
              this.props.onLongPress(this.context, this.props.currentMessage);
          }
          else if (currentMessage && currentMessage.text) {
              const { optionTitles } = this.props;
              const options = optionTitles && optionTitles.length > 0
                  ? optionTitles.slice(0, 2)
                  : DEFAULT_OPTION_TITLES;
              const cancelButtonIndex = options.length - 1;
              this.context.actionSheet().showActionSheetWithOptions({
                  options,
                  cancelButtonIndex,
              }, (buttonIndex) => {
                  switch (buttonIndex) {
                      case 0:
                          Clipboard.setString(currentMessage.text);
                          break;
                      default:
                          break;
                  }
              });
          }
      };
  }
  styledBubbleToNext() {
      const { currentMessage, nextMessage, position, containerToNextStyle, } = this.props;
      if (currentMessage &&
          nextMessage &&
          position &&
          isSameUser(currentMessage, nextMessage) &&
          isSameDay(currentMessage, nextMessage)) {
          return [
              styles[position].containerToNext,
              containerToNextStyle && containerToNextStyle[position],
          ];
      }
      return null;
  }
  styledBubbleToPrevious() {
      const { currentMessage, previousMessage, position, containerToPreviousStyle, } = this.props;
      if (currentMessage &&
          previousMessage &&
          position &&
          isSameUser(currentMessage, previousMessage) &&
          isSameDay(currentMessage, previousMessage)) {
          return [
              styles[position].containerToPrevious,
              containerToPreviousStyle && containerToPreviousStyle[position],
          ];
      }
      return null;
  }
  renderQuickReplies() {
      const { currentMessage, onQuickReply, nextMessage, renderQuickReplySend, quickReplyStyle, } = this.props;
      if (currentMessage && currentMessage.quickReplies) {
          const { containerStyle, wrapperStyle, ...quickReplyProps } = this.props;
          if (this.props.renderQuickReplies) {
              return this.props.renderQuickReplies(quickReplyProps);
          }
          return (<QuickReplies {...{
              currentMessage,
              onQuickReply,
              nextMessage,
              renderQuickReplySend,
              quickReplyStyle,
          }}/>);
      }
      return null;
  }

  renderMessageText() {
    if (this.props.currentMessage.text) {
      const { containerStyle, wrapperStyle, messageTextStyle, ...messageTextProps } = this.props;
      let deletedStyle = { fontFamily: 'RobotoMono-Italic', color: 'red', fontSize: 12, textAlign: 'center', padding: 4 };

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
        // console.log('Inide other condition?')      
        (<MessageText
              {...messageTextProps}
              textStyle={{
                left: { ...messageTextProps.textStyle, ...deletedStyle},
                right: { ...messageTextProps.textStyle, ...deletedStyle},
              }}
          />)
     }
    return null;
  }

  renderMessageImage() {
    if (this.props.currentMessage && this.props.currentMessage.image) {
        const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
        if (this.props.renderMessageImage) {
            return this.props.renderMessageImage(messageImageProps);
        }
        return <MessageImage {...messageImageProps}/>;
    }
    return null;
}
  renderMessageVideo() {
      if (this.props.currentMessage && this.props.currentMessage.video) {
          const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
          if (this.props.renderMessageVideo) {
              return this.props.renderMessageVideo(messageVideoProps);
          }
          return <MessageVideo {...messageVideoProps}/>;
      }
      return null;
  }
  renderTicks() {
      const { currentMessage, renderTicks, user } = this.props;
      if (renderTicks && currentMessage) {
          return renderTicks(currentMessage);
      }
      if (currentMessage && user && currentMessage.user && currentMessage.user._id !== user._id) {
          return null;
      }
      if (currentMessage &&
          (currentMessage.sent || currentMessage.received || currentMessage.pending)) {
          return (<View style={styles.content.tickView}>
        {!!currentMessage.sent && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
        {!!currentMessage.received && (<Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>)}
        {!!currentMessage.pending && (<Text style={[styles.content.tick, this.props.tickStyle]}>🕓</Text>)}
      </View>);
      }
      return null;
  }
  renderTime() {
      if (this.props.currentMessage && this.props.currentMessage.createdAt) {
          const { containerStyle, wrapperStyle, textStyle, ...timeProps } = this.props;
          if (this.props.renderTime) {
              return this.props.renderTime(timeProps);
          }
          return <Time {...timeProps}/>;
      }
      return null;
  }
  renderUsername() {
      const { currentMessage, user } = this.props;
      if (this.props.renderUsernameOnMessage && currentMessage) {
          if (user && currentMessage.user._id === user._id) {
              return null;
          }
          return (<View style={styles.content.usernameView}>
        <Text style={[styles.content.username, this.props.usernameStyle]}>
          ~ {currentMessage.user.name}
        </Text>
      </View>);
      }
      return null;
  }
  renderCustomView() {
      if (this.props.renderCustomView) {
          return this.props.renderCustomView(this.props);
      }
      return null;
  }
  renderBubbleContent() {
    return this.props.isCustomViewBottom ? (<View>
    {this.renderMessageImage()}
    {this.renderMessageVideo()}
    {this.renderMessageText()}
    {this.renderCustomView()}
    {this.renderLocation()}
  </View>) : (<View>
    {this.renderCustomView()}
    {this.renderMessageImage()}
    {this.renderMessageVideo()}
    {this.renderMessageText()}
    {this.renderLocation()}
  </View>);
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
    const { position, containerStyle, wrapperStyle, bottomContainerStyle, } = this.props;
    return (<View style={[
        styles[position].container,
        containerStyle && containerStyle[position],
    ]}>
    <View style={[
        styles[position].wrapper,
        wrapperStyle && wrapperStyle[position],
        this.styledBubbleToNext(),
        this.styledBubbleToPrevious(),
    ]}>
      <TouchableWithoutFeedback onLongPress={this.onLongPress} accessibilityTraits='text' {...this.props.touchableProps}>
        <View>
          {this.renderBubbleContent()}
          <View style={[
        styles[position].bottom,
        bottomContainerStyle && bottomContainerStyle[position],
    ]}>
            {this.renderUsername()}
            {this.renderTime()}
            {this.renderTicks()}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
    {this.renderQuickReplies()}
  </View>);
}

}

const Color =  {
  defaultColor: '#b2b2b2',
  backgroundTransparent: 'transparent',
  defaultBlue: '#0084ff',
  leftBubbleBackground: '#f0f0f0',
  black: '#000',
  white: '#fff',
  carrot: '#e67e22',
  emerald: '#2ecc71',
  peterRiver: '#3498db',
  wisteria: '#8e44ad',
  alizarin: '#e74c3c',
  turquoise: '#1abc9c',
  midnightBlue: '#2c3e50',
  optionTintColor: '#007AFF',
  timeTextColor: '#aaa',
};

const styles = {
  left: StyleSheet.create({
      container: {
          flex: 1,
          alignItems: 'flex-start',
      },
      wrapper: {
          borderRadius: 15,
          backgroundColor: '#1D1C27',
          marginRight: 60,
          minHeight: 20,
          justifyContent: 'flex-end',
      },
      containerToNext: {
          borderBottomLeftRadius: 3,
      },
      containerToPrevious: {
          borderTopLeftRadius: 3,
      },
      bottom: {
          flexDirection: 'row',
          justifyContent: 'flex-start',
      },
  }),
  right: StyleSheet.create({
      container: {
          flex: 1,
          alignItems: 'flex-end',
      },
      wrapper: {
          borderRadius: 15,
          backgroundColor: '#1D1C27',
          marginLeft: 60,
          minHeight: 20,
          justifyContent: 'flex-end',
      },
      containerToNext: {
          borderBottomRightRadius: 3,
      },
      containerToPrevious: {
          borderTopRightRadius: 3,
      },
      bottom: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
      },
  }),
  content: StyleSheet.create({
      tick: {
          fontSize: 10,
          backgroundColor: Color.backgroundTransparent,
          color: Color.white,
      },
      tickView: {
          flexDirection: 'row',
          marginRight: 10,
      },
      username: {
          top: -3,
          left: 0,
          fontSize: 12,
          backgroundColor: 'transparent',
          color: '#aaa',
      },
      usernameView: {
          flexDirection: 'row',
          marginHorizontal: 10,
      },
  }),
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  }
};

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
    backgroundColor: '#27292C',
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
    fontSize: 13,
    padding: 7,
    textAlign: 'center',
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


