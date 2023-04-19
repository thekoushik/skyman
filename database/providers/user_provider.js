var { user, activity, notification, message, messagehistory, email_template } = require('../models');
var { dateBetweenQuery, createBcryptHash, compareBcryptHash, createOTPToken, queryToANDQuery, escapeForRegex } = require('../../utils');

exports.userCreate = async (data) => {
    //var verifyToken=createToken(365);//one year expiry
    var verifyToken = createOTPToken();
    verifyToken.token_type = 'OTP_TOKEN';
    return user.model.create({
        ...data,
        role_email: data.role + '_' + data.email,
        password: await createBcryptHash(data.password),
        auth_token: verifyToken
    });
}

exports.getUserByUsernameAndToken = (email, type, token) => {
    return user.model.findOne({ email, 'auth_token.token_type': type, 'auth_token.token': token }).exec();
}
exports.getUser = (id, few) => {
    return user.model.findById(id)
        .select(few ? user.DTOProps : user.DTOPropsFull)
        .exec();
}
exports.getUserSelectedFields = (id, fields, populates) => {
    let q = user.model.findById(id).select(fields);
    if (populates) {
        for (let key in populates)
            q = q.populate(key, populates[key] || user.DTOPropsProfile);
    }
    return q.exec();
}
exports.getUserWhereSelectedFields = (condition, fields, populates) => {
    let q = user.model.findOne(condition).select(fields);
    if (populates) {
        for (let key in populates) {
            if (populates[key])
                q = q.populate(key, populates[key]);
            else
                q = q.populate(key);
        }
    }
    return q.exec();
}
exports.getManyUsersWhereSelectedFields = (condition, fields, populates) => {
    let q = user.model.find(condition).select(fields);
    if (populates) {
        for (let key in populates)
            q = q.populate(key, populates[key]);
    }
    return q.exec();
}
exports.getUserByEmail = (email, role) => {
    let q = { email };
    if (role) q.role = role;
    return user.model.findOne(q)
        .select(user.DTOPropsAuth)
        .exec();
}
exports.getUserByCredentials = async (email, password, role) => {
    let userData = await user.model.findOne({ email, role: role || 'USER' }).exec();
    if (!userData) return null;
    let match = await compareBcryptHash(password, userData.password);
    if (!match) return null;
    return userData;

}
exports.getAllUsers = (populate) => {
    var q = user.model.find({ role: { "$ne": user.roles.ADMIN } });
    if (populate) q = q.populate(populate);
    return q.exec();
}
exports.searchUser = (condition, search_text, role, size, last) => {
    size = (typeof size == undefined) ? 10 : Number(size);
    var query = {
        ...condition
    };
    if (role && role != user.roles.ADMIN)
        query.role = role;
    else
        query.role = { "$ne": user.roles.ADMIN };
    if (search_text)
        query['$text'] = { $search: search_text };// new RegExp(search_text,'i');
    if (last) query['_id'] = { '$gt': last };
    return user.model.find(query).select(user.DTOProps).limit(size)/*.sort(sort)*/.exec();
}
exports.searchUserRegex = (condition, search_text, role, size, last) => {
    size = (typeof size == undefined) ? 10 : Number(size);
    var query = {
        ...condition
    };
    if (role && role != user.roles.ADMIN)
        query.role = role;
    else
        query.role = { "$ne": user.roles.ADMIN };
    let search_text_filtered = escapeForRegex(search_text);
    if (search_text_filtered)
        query['$or'] = [
            { firstname: new RegExp(search_text_filtered, 'i') },
            { lastname: new RegExp(search_text_filtered, 'i') },
            { email: new RegExp(search_text_filtered, 'i') },
        ];
    if (last) query['_id'] = { '$gt': last };
    return user.model.find(query).select(user.DTOProps).limit(size).lean().exec();
}
exports.userList = (condition, search_text, search_field, sort_direction, sort_field, role, size, last) => {
    var query = {
        ...condition
    };
    let search_text_filtered = escapeForRegex(search_text);
    if (search_text_filtered)
        query[search_field] = new RegExp(search_text_filtered, 'i');
    if (role && role != user.roles.ADMIN)
        query.role = role;
    else
        query.role = { "$ne": user.roles.ADMIN };
    //if(last) query['_id']={ '$gt': last};
    let sort = {};
    let direction = 1;
    if (sort_field) {
        if (sort_direction == 'DESC' || sort_direction == 'desc') direction = -1;
        sort[sort_field] = direction;
    }
    if (last) {
        if (direction == 1)
            query['_id'] = { '$gt': last };
        else if (direction == -1)
            query['_id'] = { '$lt': last };
    }
    return user.model.find(query).select(user.DTOProps).limit(Number(size) || 10).sort(sort).exec();
}
exports.updateUserWhere = (cond, data) => {
    return user.model.findOneAndUpdate(cond, data, { new: true })
        .select(user.DTOPropsProfile)
        .exec();
}
//used by admin to change few flags
var updateUser = exports.updateUser = (id, data) => {
    return user.model.findByIdAndUpdate(id, data, { new: true })
        .select(user.DTOPropsProfile)
        .exec();
}
exports.updateAUserArrayField = async (user_id, field, value, isRemove) => {
    let data = {};
    if (isRemove) {
        data['$pull'] = { [field]: value };
    } else {
        data['$addToSet'] = { [field]: value };
    }
    return user.model.findByIdAndUpdate(user_id, data).exec();
}
exports.saveNewOTP = async (user_id) => {
    var newtoken = createOTPToken();
    newtoken.token_type = 'OTP_TOKEN';
    await updateUser(user_id, {
        auth_token: newtoken
    });
    return newtoken;
}
exports.updateDeviceToken = async (user_id, token, isRemove) => {
    if (!token) return Promise.resolve(false);
    let data = {};
    if (isRemove) {
        data['$pull'] = { device_tokens: token };
    } else {
        data['$addToSet'] = { device_tokens: token };
    }
    return user.model.findByIdAndUpdate(user_id, data).exec();
}
//total number of users
exports.count = () => {
    return user.model.estimatedDocumentCount().exec();
}
//count users with specific condition
var countWhere = exports.countWhere = (condition) => {
    return user.model.countDocuments(condition).exec();
}
exports.selectUserData = (data) => {
    return {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        photo: data.photo,
        photo_url: data.photo_url,
        mobile: data.mobile,
        address: data.address,
        street: data.street,
        city: data.city,
        postcode: data.postcode,
        state: data.state,
        country: data.country,
        role: data.role,
    };
}
exports.updateUserProfile = async (id, profileData, file) => {
    let data = {};
    data.firstname = profileData.firstname;
    data.lastname = profileData.lastname;
    let profileFields = ['mobile', 'address', 'street', 'city', 'postcode', 'state', 'country'];
    for (let key in profileData) {
        if (profileFields.includes(key)) {
            data[key] = profileData[key];
        }
    }
    if (file) data.photo = file.filename;
    let result = await user.model.findByIdAndUpdate(id, data, { new: true }).select(user.DTOPropsProfile).exec();

    /*
    //denormalization effect start
    try{
        //update message_history user1
        await messagehistory.model.updateMany({
            user1: id
        },{
            'user_info1.firstname':profileData.firstname,
            'user_info1.lastname':profileData.lastname
        }).exec();
        //update message_history user2
        await messagehistory.model.updateMany({
            user2: id
        },{
            'user_info2.firstname':profileData.firstname,
            'user_info2.lastname':profileData.lastname
        }).exec();
        //more updates here
    }catch(e){
        console.log('cascade update error')
    }
    //denormalization effect end
    */
    return result;
}

exports.updateProfilePhoto = (id, file, field) => {
    let data = {};
    if (file) {
        data[field] = file.filename;
    } else {
        data[field] = "";
    }
    return user.model.findByIdAndUpdate(id, data, { new: true }).select(user.DTOPropsProfile).exec();
}

//update password if old password matched
exports.updatePassword = async (id, oldpassword, newpassword) => {
    let userData = await user.model.findById(id).exec();
    if (!userData) return null;
    let match = await compareBcryptHash(oldpassword, userData.password);
    if (!match) return null;
    return user.model.findByIdAndUpdate(id, {
        password: await createBcryptHash(newpassword)
    }).exec();
}
//update password without checking
exports.updatePasswordDirectly = async (id, newpassword) => {
    return user.model.findByIdAndUpdate(id, {
        password: await createBcryptHash(newpassword)
    }).exec();
}
//////////////////
exports.createActivity = (user, action, description, module_name, module_id) => {
    let data = { user, action, module: module_name, description };
    if (module_id) data.module_id = module_id;
    return activity.model.create(data);
}
exports.searchActivity = (user_id, date_from, date_to, size, last) => {
    let q = {};
    if (user_id) q.user = user_id;
    if (date_from || date_to) {
        let created = dateBetweenQuery(date_from, date_to);
        q.created_at = {};
        if (date_from) q.created_at['$gte'] = created.from;
        if (date_to) q.created_at['$lte'] = created.to;
    }
    if (last) q._id = { '$lt': last };
    return activity.model.find(q).sort('-created_at').limit(Number(size) || 20).exec();
}
exports.notificationTypes = {
    welcome: 'welcome',
    new_feedback: 'new_feedback',
    feedback_reply: 'feedback_reply',
    booking_received: 'booking_received',
    booking_accepted: 'booking_accepted',
    booking_rejected: 'booking_rejected',
    booking_completed: 'booking_completed',
    booking_cancelled: 'booking_cancelled',
    payment_failed: 'payment_failed',
    refund_failed: 'refund_failed',
    custom: 'custom'
};
exports.createNotification = (user_id, notification_type, title, content, extra) => {
    let data = {
        user: user_id,
        notification_type,
        title,
        content,
    };
    if (extra) data.extra = extra;
    return notification.model.create(data);
}
exports.createNotifications = (data_array) => {
    return notification.model.create(data_array);
}
exports.countUnreadNotifications = (user_id) => notification.model.countDocuments({ user: user_id, read: false }).exec()
exports.getNotications = (user_id, size, last) => {
    size = Number(size) || 10;
    let q = {
        user: user_id
    };
    if (last) q._id = { '$lt': last };//reverse order due to sorting
    return notification.model.find(q).sort('-created_at').limit(size).exec();
}
exports.updateNotificationStatus = (user_id) => {
    return notification.model.updateMany({
        user: user_id,
        read: false
    }, {
        read: true
    }).exec();
}
exports.deleteNotifications = (user_id, id_array) => {
    let q = {
        user: user_id
    };
    //the following checking is added to provide a mechanism to delete selected notifications
    //by giving an array of notifications
    if (id_array) {
        q._id = {
            '$in': id_array
        };
    }
    return notification.model.deleteMany(q).exec();
}
exports.getMessageForUser = (user_id, user_id2, fetch_users, size, last, booking_id) => {
    let q = {
        '$or': [
            {
                to_user: user_id,
                from_user: user_id2
            },
            {
                to_user: user_id2,
                from_user: user_id
            }
        ]
    };
    if (booking_id) q.booking = booking_id;
    if (last) q._id = { '$lt': last };
    let cursor = message.model.find(q);
    if (fetch_users) {
        cursor = cursor.populate('from_user', user.DTOPropsInfo)
            .populate('to_user', user.DTOPropsInfo);
    }
    return cursor.sort('-created_at')
        .limit(Number(size) || 10)
        .lean()
        .exec();
}

exports.createMessage = (from_user, to_user, content, booking) => {
    let data = {
        from_user,
        anonymous: false,
        to_user,
        content,
        booking
    };
    return message.model.create(data);
}
exports.updateMessageRead = async (user_id, sender_id, booking) => {
    await messagehistory.model.findOneAndUpdate({
        '$or': [
            { user1: user_id, user2: sender_id },
            { user2: user_id, user1: sender_id },
        ],
        direction: sender_id + '-' + user_id
    }, {
        '$set': { unread: 0 }
    }).exec();
    let cond = {
        from_user: sender_id,
        to_user: user_id,
        read: false
    };
    if (booking) cond.booking = booking;
    await message.model.updateMany(cond, { read: true }).exec()
}
exports.createMessageHistory = async (sender_profile, receiver_profile, message, date) => {
    let receiver = receiver_profile._id;
    let sender = sender_profile._id;
    let history = await messagehistory.model.findOne({
        '$or': [
            { user1: receiver, user2: sender },
            { user2: receiver, user1: sender },
        ]
    }).exec();
    if (history) {
        let updateQuery = {
            direction: sender + '-' + receiver,
            last_message_content: message,
            last_message_date: date
        };
        if (history.direction.startsWith(sender + '-')) {
            updateQuery['$inc'] = { unread: 1 };
        } else {
            updateQuery['unread'] = 1;
        }
        await messagehistory.model.findByIdAndUpdate(history.id, updateQuery).exec();
    } else {
        await messagehistory.model.create({
            user1: sender,
            user2: receiver,
            user_info1: {//denormalisation
                firstname: sender_profile.firstname,
                lastname: sender_profile.lastname,
                email: sender_profile.email
            },
            user_info2: {//denormalisation
                firstname: receiver_profile.firstname,
                lastname: receiver_profile.lastname,
                email: receiver_profile.email
            },
            unread: 1,
            direction: sender + '-' + receiver,
            last_message_content: message,
            last_message_date: date
        });
    }
}
exports.getChatHistory = (receiver_user, search_text, size, last) => {
    let query1 = { user1: receiver_user };
    let query2 = { user2: receiver_user };
    //search by name or email
    let search_text_filtered = escapeForRegex(search_text);
    if (search_text_filtered) {
        //search the opposite user
        query1['$or'] = [
            { 'user_info2.firstname': new RegExp(search_text_filtered, 'i') },
            { 'user_info2.lastname': new RegExp(search_text_filtered, 'i') },
            { 'user_info2.email': new RegExp(search_text_filtered, 'i') }
        ];
        //convert the sub query to $and query
        query1 = queryToANDQuery(query1);
        //search the opposite user
        query2['$or'] = [
            { 'user_info1.firstname': new RegExp(search_text_filtered, 'i') },
            { 'user_info1.lastname': new RegExp(search_text_filtered, 'i') },
            { 'user_info1.email': new RegExp(search_text_filtered, 'i') }
        ];
        //convert the sub query to $and query
        query2 = queryToANDQuery(query2);
    }
    let q = {
        '$or': [
            query1,
            query2,
        ]
    };
    if (last) q._id = { '$lt': last };
    return messagehistory.model.find(q)
        .populate('user1', user.DTOPropsMin)
        .populate('user2', user.DTOPropsMin)
        .sort('-last_message_date')
        .limit(Number(size) || 10)
        //.lean()
        .exec();
}

exports.createEmailTemplates = async () => {
    let count = await email_template.model.countDocuments({}).exec();
    if (count) return false;
    await email_template.model.create([
        {
            name: "Registration-User",
            content: `<h2>Welcome to Skyman</h2><h2>Here is your OTP: </h2> {{ otp }} <br> <p>Thank you,</p> <p>Admin</p>`
        }, {
            name: "Forgot Password",
            content: `<h2>This is your one-time password {{ otp }} </h2> <br> <p>Thank you,</p> <p>Admin</p>`
        }
    ]);
    return true;
}
exports.emailTemplates = {
    'Registration-User': 'Registration-User',
    'ForgotPassword': 'Forgot Password',
};
exports.getEmailTemplates = () => {
    return email_template.model.find({}).exec();
}
exports.getEmailTemplate = (template_id) => {
    return email_template.model.findById(template_id).exec();
}
exports.getEmailTemplateByName = (name) => {
    return email_template.model.findOne({ name }).exec();
}
exports.updateEmailTemplate = (template_id, content) => {
    return email_template.model.findByIdAndUpdate(template_id, { content }).exec();
}
exports.addEmailTemplateAttachment = (template_id, filename, file) => {
    return email_template.model.findByIdAndUpdate(template_id, { "$push": { attachments: { filename, file } } }, { new: true }).exec();
}
exports.removeEmailTemplateAttachment = (template_id, file_id) => {
    return email_template.model.findByIdAndUpdate(template_id, { "$pull": { attachments: { _id: file_id } } }).exec();
}
