# Routes

## POST "/api/room/createroom"

create room api

require body = {roomName: 'aroomname', userID: '5c92fc59cf67874acc2d0b2e'}

return {confirmation: "success/fail", data: { roomID: room.\_id, roomName: room.roomName }/"errorMessage"}

## GET "/api/room/getroomlist"

get list of rooms (both joined room and not joined room) from a userID

require parameter ?userID=5c92fc59cf67874acc2d0b2e e.g. http://localhost:3000/api/room/getroomlist?userID=5c932df18662054eacc48ad3

return {confirmation: "success/fail", data: { joinedRoom: [{ "lastestRead": "", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}], notJoinedRoom: [{ "lastestRead": "", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}] }/errorMessage}

## POST "/api/room/join"

allow user to join a group chat room

require body {userID: '5c92fc59cf67874acc2d0b2e', roomID: '5c92fc59cf67874acc2d0b2e'}

return {confirmation: "success/fail", data: successfulMessage/errorMessage}

## POST "/api/room/leave"

leave group

require body = {userID: "userid", roomID:"roomID" }

return result = { confirmation: "success", data: "userID successfully leave roomID" } //success
or result = { confirmation: "failed", data: err.message } //failed

## POST "/api/room/fetchmessage"

API fetch message

require body = {roomID: '5c92fc59cf67874acc2d0b2e', lastestReadID:'-1'/'5c92fc59cf67874acc2d0b2e'}
please note that **lastestReadID** can be **-1** to represent that you've not read any message

return {confirmation: "success/fail", data: [{ "text": "message test 1", "_id": "5c949ade34dd484198a9dbe2", "sender": "5c9495ed87afa201f437a4bc"}]/errorMessage}

## GET "/api/user/username"

get id and name of username (does not exist in database --> create new user)

require /username e.g. /api/user/job

return token = {id:usename.\_id, name: username.name}

## POST "/api/user/updatelatestread" 

API to update latest read message

require body = {userID: '5c92fc59cf67874acc2d0b2e', roomID: '5c92fc59cf67874acc2d0b2e', lastestReadID:'-1'/'5c92fc59cf67874acc2d0b2e'}
please note that **lastestReadID** can be **-1** to represent that you've not read any message

return {confirmation: "success/fail", data: successfulMessage/errorMessage}