## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn dev


```
# iri-backend-task
Create User: http://localhost:3000/api/v1/users

    {
    "name": "Habib",
    "email": "tusherhrt@gmail.com",
    "password": "###AAAaaa",
    "country": "Bangladesh"
}

Getuser byID: http://localhost:3000/api/v1/users/1


delete user: http://localhost:3000/api/v1/users/8


Get all users: http://localhost:3000/api/v1/users


update user: http://localhost:3000/api/v1/users/1

    {
    // "name": "Leanne Graham",
    "email": "sincere@april.biz"
  
}

Login: http://localhost:3000/api/v1/users/login


refresh token: http://localhost:3000/api/v1/users/refresh-token   (need to pass token in headers) Bearer token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwiZW1haWwiOiJ0dXNoZXJocnRAZ21haWwuY29tIiwiaWF0IjoxNzE1NjE3NTAwLCJleHAiOjE3NDY3MjE1MDB9.XVwybbbAYZw2VegiFYz6CXkJTkd1bH4xQrp1fu8iLjY


