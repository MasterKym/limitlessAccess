# Welcome to LimitlessAccess!
A project that allows Moroccan to send phone/internet credit to students unable to afford it
This repository exposes an express.js API.

# Routes
## /admin
> Requires authentication through request cookies. The API expects a cookie named `login-token` with the jsonwebtoken provided after login.
### GET /admin/students
This route return an array of Student objects.
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
        "cardPhotos": [],
        "operations": []
      },
      ...]`

 `cardPhotos` will contain an array of objects structured like this :

     `{
     "_id: "kljbelkjbefol8998b",
     data: {
	     type: "Buffer",
	     data: [137, 80, ....., 0]}
	 },
	 contentType: "image/png"
	 }`

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

### POST /admin/register
> This route is only available to superAdmin. SuperAdmin can create regular admin accounts.

TODO

## User/Student
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
