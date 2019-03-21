# Routes

## POST "/api/createroom"
create room api

require body = {roomName: 'aroomname', userID: '5c92fc59cf67874acc2d0b2e'}

return {confirmation: "success/fail", data: { roomID: room._id, roomName: room.roomName }/"errorMessage"}