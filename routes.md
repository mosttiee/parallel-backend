# Routes

## POST "/api/createroom"

create room api

require body = {roomName: 'aroomname', userID: '5c92fc59cf67874acc2d0b2e'}

return {confirmation: "success/fail", data: { roomID: room.\_id, roomName: room.roomName }/"errorMessage"}

## GET "/api/user/username"

get id and name of username (doesn not exist in database --> create new user)

require /username e.g. /api/user/job

return token = {id:usename.\_id, name: username.name}
