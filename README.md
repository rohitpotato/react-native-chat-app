# react-native-chat-app
A react native chat application built using firebase, firebase cloud functions and react-native-gifted-chat. 

*(Feel free to open any issues if found.)*

# Features

1. Groups/Private Chat.
2. Self-destructing messages (set the timer).
3. Share Gifs.

## TODO
1. Ios Support.
2. Implement Private Chat.
3. User Search.
4. UI Improvements.
5. Information modals for groups and user info.
6. Send Images.
7. Optimization and Refactor.

# Installation
1. Follow the [react-native-firebase](https://invertase.io/oss/react-native-firebase/quick-start/android-firebase-credentials) setup guide here to correctly set up firebase.
2. `yarn add` to install all dependencies.
3. **[Initialize a firebase cloud function project](https://firebase.google.com/docs/functions/get-started).**
4. Download your admin sdk key file from *`https://console.firebase.google.com/u/0/project/YOUR_PROJECT_ID/settings/serviceaccounts/adminsdk`* and paste it inside the `functions` directory.

## Add the following code to your `functions/index.js`:

```const functions = require('firebase-functions');
const {performance} = require('perf_hooks');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('./self-destruct-native-firebase-adminsdk-7kmhp-55c3c183a7.json'))
});

// Since this code will be running in the Cloud Functions environment
// we call initialize Firestore without any arguments because it
// detects authentication from the environment.

const firestore = admin.firestore();

// Create a new function which is triggered on changes to /status/{uid}
// Note: This is a Realtime Database trigger, *not* Cloud Firestore.

exports.onUserStatusChanged = functions.database.ref('/status/{uid}').onUpdate(
    async (change, context) => {
      // Get the data written to Realtime Database
      const eventStatus = change.after.val();

      // Then use other event data to create a reference to the
      // corresponding Firestore document.
      
      const userStatusFirestoreRef = firestore.doc(`status/${context.params.uid}`);

      // It is likely that the Realtime Database change that triggered
      // this event has already been overwritten by a fast change in
      // online / offline status, so we'll re-read the current data
      // and compare the timestamps.
      
      const statusSnapshot = await change.after.ref.once('value');
      const status = statusSnapshot.val();
      console.log(status, eventStatus);
      
      // If the current timestamp for this data is newer than
      // the data that triggered this event, we exit this function.
      
      if (status.last_changed > eventStatus.last_changed) {
        return null;
      }

      // Otherwise, we convert the last_changed field to a Date
      eventStatus.last_changed = new Date(eventStatus.last_changed);

      // ... and write it to Firestore.
      
      return userStatusFirestoreRef.set(eventStatus);
    });


    exports.manageTimedMessages = functions.https.onRequest((req, res) => {
        var start = performance.now();
        console.log('----------------------------------------------------------------------------------------------')
        let ref;
        const type = req.body.type;
        if(type === 'private') {
          ref = firestore.collection('privateMessages')
        } else {
          ref = firestore.collection('messages')
        }
      
        const channelId = req.body.channelId;
        const messageId = req.body.messageId;
        const timer = req.body.timer;
        ref.doc(channelId).collection('chats').doc(messageId).get().then((message) => {
          var newMessage = { ...message.data() };
          if(message.data().duration && message.data().duration > 0) {
            if(newMessage.image) {
              delete newMessage.image;
              newMessage.text = 'This message has been deleted.'
              newMessage.messageType = 'deleted';
              newMessage.duration = 0;
            } else {
              newMessage.text = 'This message has been deleted.'
              newMessage.duration = 0;
              newMessage.messageType = 'deleted';
            }
          } 
          return ({newMessage, duration: message.data().duration});
        }).then(({newMessage, duration}) => {
          var end = performance.now();
          let execution = (end-start)/1000;
          return new Promise(function(resolve, reject) {
            setTimeout(resolve.bind(null, { document: ref.doc(channelId).collection('chats').doc(messageId), newMessage }), (duration-execution)*1000);
          })
        }).then(({document, newMessage}) => {
              return document.set(newMessage)
        }).then(message => {
           return res.json({ success: true });
        }).
        catch(e => {
          res.json({ error: 'There was an error.', e: e.toString() });
        })
    })
```
