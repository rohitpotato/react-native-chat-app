# react-native-chat-app
A react native chat application built using firebase, firebase cloud functions and react-native-gifted-chat. 

*(Feel free to open any issues if found.)*

# Features

1. Groups/Private Chat.
2. Self-destructing messages (set the timer).
3. Share Gifs.
4. MarkDown Support.
5. Location Sharing
6. Users and Channel Search.
7. Profile Section.
8. Unread Messages Indicator
9. Typing Indicator


## TODO
1. Ios Support.
2. <del>Implement Private Chat.<del>
3. <del>Location Sharing<del>
4. <del>Markdown Support<del>
5. <del>User Search.<del>
6. UI Improvements.
7. Information modals for groups and user info.
8. Send Images.
9. Optimization and Refactor.
10. Push Notifications
11. <del>Typing Indicator<del>
12. Rewrite using Hooks

# Installation
1. Follow the [react-native-firebase](https://invertase.io/oss/react-native-firebase/quick-start/android-firebase-credentials) setup guide here to correctly set up firebase. 

### (Get your `google-services.json` file from your firebase console and paste it inside `android/app` folder.)

2. `yarn install` to install all dependencies.
3. **[Initialize a firebase cloud function project](https://firebase.google.com/docs/functions/get-started).**
4. Download your admin sdk key file from *`https://console.firebase.google.com/u/0/project/YOUR_PROJECT_ID/settings/serviceaccounts/adminsdk`* and paste it inside the `functions` directory inside the cloud functions project. 

## Add the following code to your `functions/index.js`: (For self-destucting messages and online/offline presence to work)

```
const functions = require('firebase-functions');
const {performance} = require('perf_hooks');
const admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.cert(require('YOUR_ADMIN_SDK_FILE.json'))
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
        console.log(req.body.type)
        console.log(req.body.channelId);
        console.log(req.body.messageId);
        console.log(req.body.timer);
        console.log(req.body.messageType);
        if(type === 'private') {
          ref = firestore.collection('privateMessages')
        } else {
          ref = firestore.collection('messages')
        }
        // console.log(ref);
        const channelId = req.body.channelId;
        const messageId = req.body.messageId;
        const timer = req.body.timer;
        const messageType = req.body.messageType;
        ref.doc(channelId).collection('chats').doc(messageId).get().then((message) => {
          var newMessage = { ...message.data() };
          if(message.data().duration && message.data().duration > 0) {
            if (newMessage[`${messageType}`]) {
              delete newMessage[`${messageType}`]
              newMessage.text = 'This message has been deleted.'
              newMessage.messageType = 'deleted';
              newMessage.duration = 0;
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
## Make sure you have delpoyed your cloud function!
