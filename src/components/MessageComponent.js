import React from 'react';
import {
  View,
  ViewPropTypes,
  StyleSheet,
} from 'react-native';

import { Avatar, Day, utils } from 'react-native-gifted-chat';
import MessageBubble from './MessageBubble';

const { isSameUser, isSameDay } = utils;

export default class MessageComponent extends React.PureComponent {

  getInnerComponentProps() {
    const { containerStyle, ...props } = this.props;
    return {
      ...props,
      position: 'left',
      isSameUser,
      isSameDay,
    };
  }

  renderDay() {
    if (this.props.currentMessage.createdAt) {
      const dayProps = this.getInnerComponentProps();
      if (this.props.renderDay) {
        return this.props.renderDay(dayProps);
      }
      return <Day {...dayProps} />;
    }
    return null;
  }

  renderBubble() {
    const bubbleProps = this.getInnerComponentProps();
    if (this.props.renderBubble) {
      return this.props.renderBubble(bubbleProps);
    }
    return <MessageBubble {...bubbleProps} />;
  }

  renderAvatar() {
    let extraStyle;
    if (
      isSameUser(this.props.currentMessage, this.props.nextMessage)
      && isSameDay(this.props.currentMessage, this.props.nextMessage)
    ) {
      // Set the invisible avatar height to 0, but keep the width, padding, etc.
      extraStyle = { height: 0 };
    }

    const avatarProps = this.getInnerComponentProps();
    return (
      <Avatar
        {...avatarProps}
        imageStyle={{ left: [styles.slackAvatar, avatarProps.imageStyle, extraStyle] }}
      />
    );
  }

  render() {
    const marginBottom = isSameUser(this.props.currentMessage, this.props.nextMessage) ? 2 : 10;

    return (
      <View>
        {this.renderDay()}
        <View
          style={[
            styles.container,
            { marginBottom },
            this.props.containerStyle,
          ]}
        >
          {this.renderAvatar()}
          {this.renderBubble()}
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginRight: 0,
  },
  slackAvatar: {
    // The bottom should roughly line up with the first line of message text.
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});

// Message.defaultProps = {
//   renderAvatar: undefined,
//   renderBubble: null,
//   renderDay: null,
//   currentMessage: {},
//   nextMessage: {},
//   previousMessage: {},
//   user: {},
//   containerStyle: {},
// };

// Message.propTypes = {
//   renderAvatar: PropTypes.func,
//   renderBubble: PropTypes.func,
//   renderDay: PropTypes.func,
//   currentMessage: PropTypes.object,
//   nextMessage: PropTypes.object,
//   previousMessage: PropTypes.object,
//   user: PropTypes.object,
//   containerStyle: PropTypes.shape({
//     left: ViewPropTypes.style,
//     right: ViewPropTypes.style,
//   }),
// };