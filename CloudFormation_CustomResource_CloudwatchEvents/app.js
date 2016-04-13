console.log('Loading');

var response = require('cfn-response');
var AWS = require('aws-sdk');

AWS.config.apiVersions = {
    cloudwatchevents: '2015-10-07'
};

exports.handler = function (event, context) {
    
    console.log('REQUEST RECEIVED:\\n', JSON.stringify(event));
    
    AWS.config.update({ region: event.ResourceProperties.Region });
    var cloudwatchevents = new AWS.CloudWatchEvents();
    
    if (event.RequestType == 'Create') {
        
        var putRuleParams = {
            Name: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName,
            Description: 'Created by a CloudFormation template',                     
            ScheduleExpression: event.ResourceProperties.Schedule,
            State: 'ENABLED'
        };
        cloudwatchevents.putRule(putRuleParams, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                response.send(event, context, response.FAILED, err.stack);
            }                
            else {
                
                var putTargetsParams = {
                    Rule: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName, 
                    Targets: [{ Arn: event.ResourceProperties.TargetArn, Id: '0', Input: event.ResourceProperties.Input }]
                };
                cloudwatchevents.putTargets(putTargetsParams, function (err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        response.send(event, context, response.FAILED, err.stack);
                    }
                    else {
                        console.log(data);           // successful response
                        response.send(event, context, response.SUCCESS);
                    }
                });
            }
        });
    }
    
    // Does a combination of delete and then update
    if (event.RequestType == 'Update') {
        
        var removeTargetsParams = {
            Ids: ['0',],
            Rule: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName
        };
        cloudwatchevents.removeTargets(removeTargetsParams, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                response.send(event, context, response.FAILED, err.stack);
            }
            else {
                
                var deleteRuleParams = { Name: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName };
                cloudwatchevents.deleteRule(deleteRuleParams, function (err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        response.send(event, context, response.FAILED, err.stack);
                    }
                    else {
                        
                        var putRuleParams = {
                            Name: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName,
                            Description: 'Created by a CloudFormation template',                     
                            ScheduleExpression: event.ResourceProperties.Schedule,
                            State: 'ENABLED'
                        };
                        cloudwatchevents.putRule(putRuleParams, function (err, data) {
                            if (err) {
                                console.log(err, err.stack); // an error occurred
                                response.send(event, context, response.FAILED, err.stack);
                            }                
                            else {
                                
                                var putTargetsParams = {
                                    Rule: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName, 
                                    Targets: [{ Arn: event.ResourceProperties.TargetArn, Id: '0', Input: event.ResourceProperties.Input }]
                                };
                                cloudwatchevents.putTargets(putTargetsParams, function (err, data) {
                                    if (err) {
                                        console.log(err, err.stack); // an error occurred
                                        response.send(event, context, response.FAILED, err.stack);
                                    }
                                    else {                                        
                                        response.send(event, context, response.SUCCESS);
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }
    
    if (event.RequestType == 'Delete') {
        
        var removeTargetsParams = {
            Ids: ['0',],
            Rule: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName
        };
        cloudwatchevents.removeTargets(removeTargetsParams, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                response.send(event, context, response.FAILED, err.stack);
            }
            else {
                
                var deleteRuleParams = { Name: event.ResourceProperties.StackName + '_' + event.ResourceProperties.RuleName };
                cloudwatchevents.deleteRule(deleteRuleParams, function (err, data) {
                    if (err) {
                        console.log(err, err.stack); // an error occurred
                        response.send(event, context, response.FAILED, err.stack);
                    }
                    else {                        
                        response.send(event, context, response.SUCCESS);
                    }
                });
            }
        });
    }
};
