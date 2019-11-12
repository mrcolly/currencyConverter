let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Errors', () => {
  /*
   * Test the /GET route
   */
  describe('/GET convert without parameters', () => {
    it('it should return error', (done) => {
      chai.request(server)
        .get('/convert')
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.length.should.be.above(0);
          done();
        });
    });
  });

  describe('/GET convert without amount', () => {
    it('it should return error', (done) => {
      chai.request(server)
        .get('/convert')
        .query({
          src_currency: 'USD',
          dest_currency: 'CHF',
          reference_date: '2019-09-12'
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.length.should.be.above(0);
          done();
        });
    });
  });

  describe('/GET convert without src_currency', () => {
    it('it should return error', (done) => {
      chai.request(server)
        .get('/convert')
        .query({
          amount: 32,
          dest_currency: 'CHF',
          reference_date: '2019-09-12'
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.length.should.be.above(0);
          done();
        });
    });
  });

  describe('/GET convert without dest_currency', () => {
    it('it should return error', (done) => {
      chai.request(server)
        .get('/convert')
        .query({
          amount: 32,
          src_currency: 'USD',
          reference_date: '2019-09-12'
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.length.should.be.above(0);
          done();
        });
    });
  });

  describe('/GET convert with unavailable currency', () => {
    it('it should return error', (done) => {
      chai.request(server)
        .get('/convert')
        .query({
          amount: 32,
          src_currency: 'KKK',
          dest_currency: 'CHF',
          reference_date: '2019-09-12'
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.length.should.be.above(0);
          done();
        });
    });
  });

  describe('/GET convert with unavailable date', () => {
    it('it should return error', (done) => {
      chai.request(server)
        .get('/convert')
        .query({
          amount: 32,
          src_currency: 'USD',
          dest_currency: 'CHF',
          reference_date: '2022-09-12'
        })
        .end((err, res) => {
          res.should.have.status(500);
          res.body.message.length.should.be.above(0);
          done();
        });
    });
  });

});

describe('Ok', () => {
  /*
   * Test the /GET route
   */
  describe('/GET convert standard', () => {
    it('it should work as expected', (done) => {
      chai.request(server)
        .get('/convert')
        .query({
          amount: 32,
          src_currency: 'USD',
          dest_currency: 'CHF',
          reference_date: '2019-11-12'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.currency.length.should.be.above(0);
          res.body.amount.should.be.a('number');
          done();
        });
    });
  });

  describe('/GET convert without reference_date', () => {
    it('it should fallback to current date', (done) => {
      chai.request(server)
        .get('/convert')
        .query({
          amount: 32,
          src_currency: 'USD',
          dest_currency: 'CHF'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.currency.length.should.be.above(0);
          res.body.amount.should.be.a('number');
          done();
        });
    });
  });

});


