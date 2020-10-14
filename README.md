# Welcome to LimitlessAccess!
A project that allows Moroccan to send phone/internet credit to students unable to afford it
This repository exposes an express.js API.
# Demo 
live: https://limitlessaccess.netlify.app
# Routes
## /admin
> Requires authentication through request cookies. The API expects a cookie named `login-token` with the jsonwebtoken provided after login.
### GET /admin/students?verified
This route return an array of Student objects.
You can filter verified students by supplying a `verified` query string. If not specified the API returns a mixed array.
example of response : 

    `[
      {
        "_id": "5ea2e25b4c634d3253d4cbd9",
        "firstName": "first",
        "lastName": "last",
        "studyNumber": "12",
        "phone": "0620203041",
        "city": "beni mellal",
        "date_created": "2020-04-24T12:58:03.022Z",
        "__v": 0,
        "operations": []
      },
      ...]`

	 
### GET /admin/students/:id
This route return a single student object.
|Query|Type|Conditions|
|----------------|-------------------------------|-----------------------------|
|`:id`|`string`|`required` `length === 24`|

> Response Example

    {
      "student": {
        "verified": true,
        "_id": "5ea36a235f66ca2a9f0e0d7b",
        "firstName": "first1",
        "lastName": "last1",
        "studyNumber": "199999999",
        "school": "hello",
        "phone": "0620203043",
        "city": "beni mellal",
        "date_created": "2020-04-24T22:37:23.198Z",
        "__v": 0,
        "cardPhotos": [],
        "operations": []
      }
    }
    
 `cardPhotos` will contain an array of objects structured like this :

      "cardPhotos": [
        {
          "_id": "5eabcba1fc82aa76415bb8bb",
          "path": "uploads/sh-first1last12020-05-01T07:11:29.290Z.png",
          "mimeType": "image/png"
        },
        {
          "_id": "5eabcba1fc82aa76415bb8bc",
          "path": "uploads/sh-first1last12020-05-01T07:11:29.292Z.png",
          "mimeType": "image/jpeg"
        }
      ]

>Possible responses

`< HTTP/1.1 404 Not Found`
> No student with that id.

`< HTTP/1.1 401 Unauthorized`
> Bad authentication. You need to send `login-token` cookie with the request

### GET /admin/userphoto?path
|Query|Type|Conditions|
|----------------|-------------------------------|-----------------------------|
|`:id`|`string`|`required`|

> This route returns a png file


### POST /admin/login
This is the route for admin login.
> Always check res.data for further information and error logs.
Possible responses:
`< HTTP/1.1 400 Bad Request`
> The request is not correctly formatted. Check missing fields or wrong field types.

`< HTTP/1.1 404 Not Found`
> No admin account under that username

`< HTTP/1.1 401 Unauthorized`
> Wrong password to existing username

`< HTTP/1.1 200 OK`
> Successful login

>Successful response example

    {
      "message": "Successful Login",
      "admin": {
        "_id": "5ea7217bc2c1ef00179bac77",
        "username": "admin001",
        "isSuper": false
      }
    }

### GET /admin/checklogin
Possible responses.

`< HTTP/1.1 401 Unauthorized`
> Admin is not logged in.

`< HTTP/1.1 200 OK`
> Admin is logged in.

`< HTTP/1.1 400 Bad Request`
> Invalid token. Admin is not logged in.

>Successful response example

    {
      "admin": {
        "_id": "5ea72561df35a61a40b083f2",
        "username": "amine001",
        "isSuper": true,
        "iat": 1588329445,
        "exp": 1588351045
      }
    }



### POST /admin/register
> This route is only available to superAdmin. SuperAdmin can create regular admin accounts.

Necessary Fields
|Field|Type|Conditions|
|----------------|-------------------------------|-----------------------------|
|username|`string`|`required` `5 < length < 21`|
|password|`string`|`required` `5 < length < 21`|

Possible responses.
`< HTTP/1.1 400 Bad Request`
> The request is not correctly formatted. Check missing fields or wrong field types.

`< HTTP/1.1 401 Unauthorized`
>User not looged in as superAdmin.

`< HTTP/1.1 200 OK`
> Successful admin creation

Response example:
>`< HTTP/1.1 200 OK`
> Successful login
    
    {
      "username": "amine0003",
      "isSuper": false,
      "city": "casablanca"
    }
## /admin/students
### GET /admin/students?limit=<limit>&skip=<skip>

|Field|Type|Conditions|Default|Usage|
|----------------|-------------------------------|-----------------------------|--|--|
|limit|`string`|`9 < limit < 51`|10|Used to limit the count of the documents in the response|
|skip|`string`|`0 < skip`|0|Skip a given number of documents for features like pagination|
>Response example

    {
      "count": 32,
      "students": [
        {
          "verified": true,
          "_id": "5ea2e25b4c634d3253d4cbd9",
          "firstName": "first",
          "lastName": "last",
          "studyNumber": "12",
          "phone": "0620203041",
          "city": "beni mellal",
          "date_created": "2020-04-24T12:58:03.022Z",
          "__v": 0,
          "operations": []
        },
        {
          "verified": true,
          "_id": "5ea2e3211e03033452b8f122",
          "firstName": "first",
          "lastName": "last",
          "studyNumber": "999999999999",
          "phone": "0620203042",
          "city": "beni mellal",
          "date_created": "2020-04-24T13:01:21.800Z",
          "__v": 0,
          "operations": []
        },
        {
          "verified": true,
          "_id": "5ea36a235f66ca2a9f0e0d7b",
          "firstName": "first1",
          "lastName": "last1",
          "studyNumber": "199999999",
          "school": "hello",
          "phone": "0620203043",
          "city": "beni mellal",
          "date_created": "2020-04-24T22:37:23.198Z",
          "__v": 0,
          "operations": []
        }
     ]
    }


## POST admin/students/verify
|Field|Type|Conditions|Usage|
|----------------|-------------------------------|-----------------------------|-|
|id|`string`|`limit.length === 24`|This is the student's id we wish to verify|
>Possible responses

`< HTTP/1.1 400 Bad Request`

    {
      "error": "Already verified",
      "message": "This student has already been verified"
    }
    or
    {
      "error": "Invalid id",
      "message": "Please provide a student id."
    }

`< HTTP/1.1 404 Not Found`

    {
      "message": "Incorrect id. No student with this id"
    }

> `HTTP/1.1 200 OK`
    {
      "message": "Successful update",
      "newStudent": {
        "verified": true,
        "_id": "5ea6a4af5103f74d3ce258da",
        "firstName": "first1",
        "lastName": "last1",
        "studyNumber": "54559",
        "school": "school",
        "phone": "0681255958",
        "phoneOperator": "IAM",
        "city": "beni mellal",
        "cardPhotos": [...],
        "operations": [...]
        }
    }

## POST /admin/students/operate
|Field|Type|Conditions|Usage|
|----------------|-------------------------------|-----------------------------|--|
|id|`string`|`limit.length === 24`|This is the student's id we wish to verify|
|value|`string`|`value === 5 || 10 ||20`|This is the value of the operation we wish to mark as done|
>Response example upon request success

> `HTTP/1.1 200 OK`    

    {
        "verified": true,
        "_id": "5ea6a4af5103f74d3ce258da",
        "firstName": "first1",
        "lastName": "last1",
        "studyNumber": "54559",
        "school": "school",
        "phone": "0681255958",
        "phoneOperator": "IAM",
        "city": "beni mellal",
        "cardPhotos": [...],
	    "operations": [
	          {
	            "by": {
	              "username": "username12",
	              "id": "5ea224ebcc559f1b8a986931"
	            },
	            "time": "2020-04-27T09:33:20.254Z",
	            "_id": "5ea6a6e04dc96f4f42a6846b",
	            "value": 10
	          },
	          {
	            "by": {
	              "username": "username12",
	              "id": "5ea224ebcc559f1b8a986931"
	            },
	            "time": "2020-04-27T09:33:24.804Z",
	            "_id": "5ea6a6e44dc96f4f42a6846c",
	            "value": 10
	          },
	        ],
        "date_created": "2020-04-27T09:33:04.338Z",
        "__v": 3
      }

> Possible Responses

>`< HTTP/1.1 400 Bad Request`

    {
      "error": "Invalid id",
      "message": "Invalid id length."
    }
    or 
    {
      "error": "Invalid operation value",
      "message": "Please provide an operation value, either 5, 10 or 20"
    }
>
`< HTTP/1.1 404 Not Found`

    {
      "message": "Incorrect id. No student with this id"
    }

## /student
### POST /addstudent
> This post method submits multiple fields through a form. They all go through validation before any queries are made. Make sure they are named correctly.

**Request Fields**:

|   Field|Type|Conditions                         |
|----------------|-------------------------------|-----------------------------|
|firstName|`string`|`3 =< length =< 20` `required`            |
|lastName|`string`|`3 =< length =< 20` `required`         |
|studyNumber|`string`|`0 =< length =< 12` `required`|
|school|`string`|`0 =< length =< 20` `required`|
|phone|`string`|`length === 10` `required`|
|phoneOperator|`string`|`0 =< length =< 10`|
|city|`string`|`length =< 40` `required`|
|cardPhotos| `string`|`length === 2` `required`

Possible responses:
`< HTTP/1.1 400 Bad Request`
> The request is not correctly formatted. Check missing fields or wrong field types or wrong field names.

`< HTTP/1.1 409 Conflict`
> Information already used. This applies to phoneNumber and studyNumber. If any of the two is already used then this response gets sent.

`< HTTP/1.1 500 Internal Server Error`
> Internal Server Error. has nothing to do with request.

`< HTTP/1.1 200 OK`
> Successful submission.











