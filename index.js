const express = require('express');
const fs = require('fs');
const logger = require('morgan');
const Rates = require('./rates');


var app = express();

//prepare Logs
if (!fs.existsSync('./logs/')) {
    fs.mkdirSync('./logs/');
}
var logStream = fs.createWriteStream(`./logs/${new Date().toLocaleDateString()}.log`, {
    flags: 'a+'
});
app.use(logger('dev', {
    stream: logStream,
}));
app.use(logger('dev'));


app.get('/convert', async (req, res, next) => {
    try {
        const params = getConvertParameters(req);
        const rates = await new Rates(params.reference_date);
        res.json(rates.getConversion(params));
    } catch (error) {
        res
            .status(500)
            .json({
                message: error.message
            });
    }

})

app.listen(3000, () => {
    console.log('app listening on port 3000')
});

const getConvertParameters = (req) => {
    const amount = req.query.amount ? parseNumber(req.query.amount) : null;
    const src_currency = req.query.src_currency ? req.query.src_currency.toUpperCase() : null;
    const dest_currency = req.query.dest_currency ? req.query.dest_currency.toUpperCase() : null;
    const reference_date = getDate(req.query.reference_date);

    let parameters = {
        amount,
        src_currency,
        dest_currency,
        reference_date
    }

    //check if parameters are valid
    for (key in parameters) {
        if (!parameters[key])
            throw new Error(`request param ${key} is wrong or not defined`);
    }
    return parameters;
}


//utility functions
const parseNumber = (param) => {
    let num = parseFloat(param);
    if (isNaN(num)) {
        throw new Error(`${param} is not a number`);
    } else {
        return num;
    }
}

const getDate = (dateString) => {
    let date = dateString ? new Date(dateString) : new Date();
    return date instanceof Date && !isNaN(date) && date;
}

module.exports = app;
