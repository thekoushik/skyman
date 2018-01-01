exports.alertToArray=function(flashes){
    var alerts=[];
    const colors={
        error:'alert-danger',
        success:'alert-success',
        info:'alert-info',
        warning:'alert-warning'
    };
    for(var alert_type in flashes){
        var type='alert-info';
        if(colors[alert_type])
            type=colors[alert_type];
        alerts=alerts.concat(flashes[alert_type].map(function(msg){
            return {type:type,message:msg};
        }));
    }
    return alerts;
};