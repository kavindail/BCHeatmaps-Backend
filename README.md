curl -X POST http://localhost:3000/activityPoints
-H "Content-Type: application/json"
-d '{"latitude": "4", "longitude": "5"}'

curl --request GET \
 --url https://api.repliers.io/listings/locations \
 --header 'REPLIERS-API-KEY: d1E4q131b04XKIDlQ9A0WhhSu9asDG' \
 --header 'accept: application/json'

curl -X POST http://localhost:3000/activityPoints/activeCoordinates | jq .

curl -X GET http://localhost:3000/activityPoints | jq .

curl -X DELETE http://localhost:3000/activityPoints | jq .

curl -X POST http://localhost:3000/auth/signup \
-H "Content-Type: application/json" \
-d '{"email": "testser@email.com", "password": "testPassword"}'

http://localhost:3000/auth/login
