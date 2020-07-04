//connect
const AWS = require('aws-sdk');
var doc=new AWS.DynamoDB.DocumentClient();
exports.handler =async(event, context) => {
  const func=async(connectionId)=>{
    return new Promise((resolve, reject) => {
      var params={
        TableName:"chat",
        Item:{"connectionId": connectionId, "room": "Default" ,"username":"user"}
      };
      doc.put(params, function(err, data){
        if(err)
          reject();
        resolve(data);
      });
    });
  };
  await func(event.requestContext.connectionId);
  return {
    statusCode: 200,
    body: "connect"
  };
}

//disconnect
const AWS = require('aws-sdk');
var doc=new AWS.DynamoDB.DocumentClient();
require('./patch.js');
exports.handler =async(event, context) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  const xx=`${new Date()}`.indexOf("GMT+");
  const s=`${new Date()}`.substring(0,xx);
  const func=async(connectionId)=>{
    return new Promise((resolve, reject) => {
      var params={
        TableName:"chat",
        Key:{"connectionId":connectionId}
      };
      doc.delete(params, function(err, data){
        if(err)
          reject();
        resolve(data);
      });
    });
  };
  const find=async(connectionId)=>{
      return new Promise((resolve, reject) => {
        var params={
          TableName:"chat",
          Key:{"connectionId":connectionId}
        };
        doc.get(params, function(err, data){
          if(err){
            reject();
          }
          resolve(data.Item);
        });
      });
  };
  const findAllConnectionsOfRoom=async(room)=>{
      return new Promise((resolve, reject) => {
        var params = {
          TableName : "chat",
          ProjectionExpression: "connectionId,#r,username",
          FilterExpression: "#r = :rr",
          ExpressionAttributeNames:{"#r": "room"},
          ExpressionAttributeValues: {":rr": room}
        };
        doc.scan(params, function(err, data){
          if(err){
            reject();
          }
          resolve(data.Items);
        });
      });
  };
  const postMessage = async (connectionId, data, apigwManagementApi) => {
        await apigwManagementApi.postToConnection({
          ConnectionId: connectionId,
          Data: data
        }).promise();
  };
  const x=await find(event.requestContext.connectionId);
  await func(event.requestContext.connectionId);
  const activeConnection=await findAllConnectionsOfRoom(x.room);
  const activeConnectionIds = activeConnection.map(obj => obj.connectionId);
  const activeConnectedUsers=activeConnection.map(obj => obj.username);
  try{
      const postAll = activeConnectionIds.map(async (id) => {
        if(id){
          return postMessage(id, JSON.stringify({action:"disconnect",username:x.username,users:activeConnectedUsers,time:s}), apigwManagementApi);  
        }
      });
      await Promise.all(postAll);
    }catch(err){
  }
  return {
    statusCode: 200,
    body: "disconnect "
  };
}

//leave
const AWS = require('aws-sdk');
var doc=new AWS.DynamoDB.DocumentClient();
require('./patch.js');
exports.handler =async(event, context) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  const xx=`${new Date()}`.indexOf("GMT+");
  const s=`${new Date()}`.substring(0,xx);
  const func=async(connectionId)=>{
    return new Promise((resolve, reject) => {
      var params={
        TableName:"chat",
        Key:{"connectionId":connectionId}
      };
      doc.delete(params, function(err, data){
        if(err)
          reject();
        resolve(data);
      });
    });
  };
  const find=async(connectionId)=>{
      return new Promise((resolve, reject) => {
        var params={
          TableName:"chat",
          Key:{"connectionId":connectionId}
        };
        doc.get(params, function(err, data){
          if(err){
            reject();
          }
          resolve(data.Item);
        });
      });
  };
  const findAllConnectionsOfRoom=async(room)=>{
      return new Promise((resolve, reject) => {
        var params = {
          TableName : "chat",
          ProjectionExpression: "connectionId,#r,username",
          FilterExpression: "#r = :rr",
          ExpressionAttributeNames:{"#r": "room"},
          ExpressionAttributeValues: {":rr": room}
        };
        doc.scan(params, function(err, data){
          if(err){
            reject();
          }
          resolve(data.Items);
        });
      });
  };
  const postMessage = async (connectionId, data, apigwManagementApi) => {
        await apigwManagementApi.postToConnection({
          ConnectionId: connectionId,
          Data: data
        }).promise();
  };
  const x=await find(event.requestContext.connectionId);
  await func(event.requestContext.connectionId);
  const activeConnection=await findAllConnectionsOfRoom(x.room);
  const activeConnectionIds = activeConnection.map(obj => obj.connectionId);
  const activeConnectedUsers=activeConnection.map(obj => obj.username);
  try{
      const postAll = activeConnectionIds.map(async (id) => {
        if(id){
          return postMessage(id, JSON.stringify({action:"disconnect",username:x.username,users:activeConnectedUsers,time:s}), apigwManagementApi);  
        }
      });
      await Promise.all(postAll);
    }catch(err){
  }
  const funcc=async(connectionId)=>{
    return new Promise((resolve, reject) => {
      var params={
        TableName:"chat",
        Item:{"connectionId": connectionId, "room": "Default" ,"username":"user"}
      };
      doc.put(params, function(err, data){
        if(err)
          reject();
        resolve(data);
      });
    });
  };
  await funcc(event.requestContext.connectionId);
  return {
    statusCode: 200,
    body: "leave "
  };
}

//add
const AWS = require('aws-sdk');
var doc=new AWS.DynamoDB.DocumentClient();
require('./patch.js');
exports.handler =async(event, context) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  const xx=`${new Date()}`.indexOf("GMT+");
  const s=`${new Date()}`.substring(0,xx);
  const body = JSON.parse(event.body);
  const user = body.user;
  const room=body.room;
  const func=async(connectionId,user,room)=>{
    return new Promise((resolve, reject) => {
      var params={
        TableName:"chat",
        Key:{"connectionId": connectionId},
        UpdateExpression: "set username = :u , room = :r",
        ExpressionAttributeValues:{":u":user,":r":room},
        ReturnValues:"UPDATED_NEW"
      };
      doc.update(params, function(err, data){
        if(err)
          reject();
        resolve(data);
      });
    });
  };
  const findAllConnectionsOfRoom=async(room)=>{
      return new Promise((resolve, reject) => {
        var params = {
          TableName : "chat",
          ProjectionExpression: "connectionId,#r,username",
          FilterExpression: "#r = :rr",
          ExpressionAttributeNames:{"#r": "room"},
          ExpressionAttributeValues: {":rr": room}
        };
        doc.scan(params, function(err, data){
          if(err){
            reject();
          }
          resolve(data.Items);
        });
      });
  };
  const postMessage = async (connectionId, data, apigwManagementApi) => {
        await apigwManagementApi.postToConnection({
          ConnectionId: connectionId,
          Data: data
        }).promise();
  };
  await func(event.requestContext.connectionId,user,room);
  const activeConnection=await findAllConnectionsOfRoom(room);
  const activeConnectionIds = activeConnection.map(obj => obj.connectionId);
  const activeConnectedUsers=activeConnection.map(obj => obj.username);
  try{
      const postAll = activeConnectionIds.map(async (id) => {
        if(id){
          return postMessage(id, JSON.stringify({action:"add",username:user,users:activeConnectedUsers,time:s}), apigwManagementApi);  
        }
      });
      await Promise.all(postAll);
    }catch(err){
  }
  return {
    statusCode: 200,
    body: "added"
  };
}


//send
const AWS = require('aws-sdk');
var doc=new AWS.DynamoDB.DocumentClient();
require('./patch.js');
exports.handler =async(event, context) => {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage
  });
  const xx=`${new Date()}`.indexOf("GMT+");
  const s=`${new Date()}`.substring(0,xx);
  const body = JSON.parse(event.body);
  const find=async(connectionId)=>{
      return new Promise((resolve, reject) => {
        var params={
          TableName:"chat",
          Key:{"connectionId":connectionId}
        };
        doc.get(params, function(err, data){
          if(err){
            reject();
          }
          resolve(data.Item);
        });
      });
  };
  const findAllConnectionsOfRoom=async(room)=>{
      return new Promise((resolve, reject) => {
        var params = {
          TableName : "chat",
          ProjectionExpression: "connectionId,#r,username",
          FilterExpression: "#r = :rr",
          ExpressionAttributeNames:{"#r": "room"},
          ExpressionAttributeValues: {":rr": room}
        };
        doc.scan(params, function(err, data){
          if(err){
            reject();
          }
          resolve(data.Items);
        });
      });
  };
  const postMessage = async (connectionId, data, apigwManagementApi) => {
        await apigwManagementApi.postToConnection({
          ConnectionId: connectionId,
          Data: data
        }).promise();
  };
  const x=await find(event.requestContext.connectionId);
  const activeConnection=await findAllConnectionsOfRoom(x.room);
  const activeConnectionIds = activeConnection.map(obj => obj.connectionId);
  try{
      const postAll = activeConnectionIds.map(async (id) => {
        if(id){
          return postMessage(id,JSON.stringify({action:"send",msg:body.msg,username:body.user,time:s}), apigwManagementApi);  
        }
      });
      await Promise.all(postAll);
    }catch(err){
  }
  return {
    statusCode: 200,
    body: "successfully broadcasted"
  };
}


//checkUsername
const AWS = require('aws-sdk');
var doc=new AWS.DynamoDB.DocumentClient();
exports.handler=(event,context,callback)=>{
  var params = {
      TableName : "chat",
      ProjectionExpression: "#u",
      FilterExpression: "#u = :uu",
      ExpressionAttributeNames:{"#u": "username"},
      ExpressionAttributeValues: {":uu": event.username}
  };
  doc.scan(params,function(err,data){
    callback(err,data.Items);
  });
};


//checkRoom
const AWS = require('aws-sdk');
var doc=new AWS.DynamoDB.DocumentClient();
exports.handler=(event,context,callback)=>{
  var params = {
      TableName : "chat",
      ProjectionExpression: "#r",
      FilterExpression: "#r = :rr",
      ExpressionAttributeNames:{"#r": "room"},
      ExpressionAttributeValues: {":rr": event.room}
  };
  doc.scan(params,function(err,data){
    callback(err,data.Items);
  });
};
