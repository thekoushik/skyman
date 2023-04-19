var admin = require("firebase-admin");
var fcmReady=false;
if(global.config.fcm){
    admin.initializeApp({
        credential: admin.credential.cert(global.config.fcm.auth),
        //databaseURL: "<your database URL here>"
    });
    fcmReady=true;
}
exports.sendViaFCM=(registrationToken,payload,topic)=>{
    if(fcmReady){
        if(registrationToken){
            return admin.messaging().sendToDevice(registrationToken, payload, {
                priority: "high",
                timeToLive: 60 * 60 *24
            })
        }else if(topic){
            return admin.messaging().sendToTopic(topic, payload, {
                priority: "high",
                timeToLive: 60 * 60 *24
            });
        }else{
            return Promise.reject('registration token or topic needed');
        }
    }else{
        return Promise.reject('FCM not configured')
    }
}
exports.registerDeviceToTopic=(registrationToken,topic)=>{
    if(fcmReady){
        return admin.messaging().subscribeToTopic(registrationToken,topic)
    }else{
        return Promise.reject('FCM not configured')
    }
}
exports.unRegisterDeviceToTopic=(registrationToken,topic)=>{
    if(fcmReady){
        return admin.messaging().unsubscribeFromTopic(registrationToken,topic)
    }else{
        return Promise.reject('FCM not configured')
    }
}
