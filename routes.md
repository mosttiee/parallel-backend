# Routes

## POST "/api/room/createroom"

create room api

require body = {roomName: 'aroomname', userID: '5c92fc59cf67874acc2d0b2e'}

return {confirmation: "success/fail", data: { roomID: room.\_id, roomName: room.roomName }/"errorMessage"}

## GET "/api/room/getroomlist"

get list of rooms (both joined room and not joined room) from a userID

require parameter ?userID=5c92fc59cf67874acc2d0b2e e.g. http://localhost:3000/api/room/getroomlist?userID=5c932df18662054eacc48ad3

return {confirmation: "success/fail", data: { joinedRoom: [{ "lastestRead": "", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}], notJoinedRoom: [{ "lastestRead": "", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}] }/errorMessage}

## GET "/api/user/username"

get id and name of username (does not exist in database --> create new user)

require /username e.g. /api/user/job

return token = {id:usename.\_id, name: username.name}

## POST "/api/room/leave"

leave group

require body = {userID: "userid", roomID:"roomID" }

return result = { confirmation: "success", data: "userID successfully leave roomID" } //success
or result = { confirmation: "failed", data: err.message } //failed
