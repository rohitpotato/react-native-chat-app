import React from 'react';
import {
  View,
  ViewPropTypes,
  StyleSheet,
  PropTypes
} from 'react-native';

import { Avatar, Day, utils } from 'react-native-gifted-chat';
import MessageBubble from './MessageBubble';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import { setProfile } from '../redux/actions/authActions';

const { isSameUser, isSameDay } = utils;

const styles = {
  left: StyleSheet.create({
      container: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          marginLeft: 8,
          marginRight: 0,
      },
  }),
  right: StyleSheet.create({
      container: {
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          marginLeft: 0,
          marginRight: 8,
      },
  }),
};
class MessageComponent extends React.Component {
  shouldComponentUpdate(nextProps) {
      const next = nextProps.currentMessage;
      const current = this.props.currentMessage;
      const { previousMessage, nextMessage } = this.props;
      const nextPropsMessage = nextProps.nextMessage;
      const nextPropsPreviousMessage = nextProps.previousMessage;
      const shouldUpdate = (this.props.shouldUpdateMessage &&
          this.props.shouldUpdateMessage(this.props, nextProps)) ||
          false;
      return (next.sent !== current.sent ||
          next.received !== current.received ||
          next.pending !== current.pending ||
          next.createdAt !== current.createdAt ||
          next.text !== current.text ||
          next.image !== current.image ||
          next.video !== current.video ||
          next.audio !== current.audio ||
          previousMessage !== nextPropsPreviousMessage ||
          nextMessage !== nextPropsMessage ||
          shouldUpdate);
  }
  renderDay() {
      if (this.props.currentMessage && this.props.currentMessage.createdAt) {
          const { containerStyle, ...props } = this.props;
          if (this.props.renderDay) {
              return this.props.renderDay(props);
          }
          return <Day {...props}/>;
      }
      return null;
  }
  renderBubble() {
      const { containerStyle, ...props } = this.props;
      if (this.props.renderBubble) {
          return this.props.renderBubble(props);
      }
      return <MessageBubble {...props}/>;
  }
  renderSystemMessage() {
      const { containerStyle, ...props } = this.props;
      if (this.props.renderSystemMessage) {
          return this.props.renderSystemMessage(props);
      }
      return <SystemMessage {...props}/>;
  }
  renderAvatar() {
      const { user, currentMessage, showUserAvatar } = this.props;
      if (user &&
          user._id &&
          currentMessage &&
          currentMessage.user &&
          user._id === currentMessage.user._id &&
          !showUserAvatar) {
          return null;
      }
      if (currentMessage && currentMessage.user && currentMessage.user.avatar === null) {
          return null;
      }
      const { containerStyle, ...props } = this.props;
      return <Avatar {...props}/>;
  }
  render() {
      const { currentMessage, nextMessage, position, containerStyle } = this.props;
      if (currentMessage) {
          const sameUser = isSameUser(currentMessage, nextMessage);
          return (<View>
        {this.renderDay()}
        {currentMessage.system ? (this.renderSystemMessage()) : (<View style={[
              styles[position].container,
              { marginBottom: sameUser ? 2 : 10 },
              !this.props.inverted && { marginBottom: 2 },
              containerStyle && containerStyle[position],
          ]}>
            {this.props.position === 'left' ? this.renderAvatar() : null}
            {this.renderBubble()}
            {this.props.position === 'right' ? this.renderAvatar() : null}
          </View>)}
      </View>);
      }
      return null;
  }
}

export default MessageComponent;

//# sourceMappingURL=Message.js.map