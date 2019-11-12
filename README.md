# Currency Converter

this project converts currencies with a simple GET api

### Installation
change .env file
NODE_ENV determines if the docker should run untitTests or App
```text
APP_PATH=< absolute path of the app >
DESTINATION_PATH=/app
NODE_ENV=< test | dev >
```


Install dependencies.

```sh
$ cd currency_converter/app
$ npm i
$ cd ..
```

run docker 
```sh
$ docker-compose up
```
the app will run on port 3000


## Api
##### convert
convert currencies
```http
GET /convert?amount=32&src_currency=usd&dest_currency=EUR&reference_date=2019-09-12
```

| Parameter | Type | Description |
| :--- | :--- | :--- |
| `amount` | `number` | **Required** |
| `src_currency` | `string` | **Required** |
| `dest_currency` | `string` | **Required** |
| `reference_date` | `date` | if not present sets current date |

##### Response
status code 200
```javascript
{
    "amount": 29.19,
    "currency": "EUR"
}
```
status code 500
```javascript
{
    "message": "request param amount is wrong or not defined"
}
```
