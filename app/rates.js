const request = require("request-promise");
const xml2js = require('xml2js');
const fs = require('fs');

//http options
const options = {
    method: 'GET',
    url: 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml',
};

class Rates {
    constructor(date) {
        return (async () => {
            let file;

            //read file if exists
            try {
                file = JSON.parse(fs.readFileSync('./data/rates.json', 'utf8'));
            } catch (error) {
                console.warn('cannot read file')
            }

            this.rates = file && file.rates;

            //check if data is available for given date
            if (!this.getRates(date)) {
                console.log(`file doesnt have ${date}`)
                this.rates = await getLatestRates();
                if (!this.getRates(date)) {
                    throw new Error(`cannot get data for date ${date}`);
                }
            }

            //write file
            fs.writeFile('./data/rates.json', JSON.stringify(this, null, 2), (error) => {});
            return this;
        })();
    }

    getRates(date) {
        try {
            return this.rates[date.toISOString().split('T')[0]];
        } catch (error) {
            return null;
        }
    }

    getConversion(params) {
        let currentRates = this.getRates(params.reference_date);
        let amount = params.amount;
        let src_rate = currentRates[params.src_currency];
        let dest_rate = currentRates[params.dest_currency]
        if ( src_rate && dest_rate ) {
            console.log(`converting ${amount} ${params.src_currency} to ${params.dest_currency}`)
            let eurAmount = amount/src_rate;
            console.log(`EUR ${eurAmount}`);
            let dest_amount = eurAmount*dest_rate;
            console.log(`${params.dest_currency} ${dest_amount}`);
            return {
                amount: Math.round( dest_amount * 1e2 ) / 1e2,
                currency: params.dest_currency
            }
        } else {
            throw new Error(`cannot gat data for given currencies`)
        }
    }
}

const convertDatesToObject = (array) => {
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item.date]: item.rates.reduce((rates, rateItem) => {
                return {
                    ...rates,
                    [rateItem.currency]: rateItem.rate,
                }
            }, {
                'EUR': '1'
            }),
        };
    }, {});
};

const getLatestRates = async () => {
    let resp = await request(options);
    let parser = new xml2js.Parser();
    let result = await parser.parseStringPromise(resp);
    let dates = result['gesmes:Envelope'].Cube[0].Cube
        .map((date) => {
            return {
                date: date['$'].time,
                rates: date.Cube.map((rate) => {
                    return rate['$']
                }),
            }
        });

    return convertDatesToObject(dates);
}

module.exports = Rates;