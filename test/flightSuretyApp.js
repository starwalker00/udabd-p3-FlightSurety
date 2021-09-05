
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety App Tests', async (accounts) => {

  var config;
  before('setup FlightSuretyApp contract', async () => {
    config = await Test.Config(accounts);
  });

  it(`verifies contract owner`, async function () {
    let contractOwner = await config.flightSuretyApp.contractOwner({ from: config.randomUser });
    assert.equal(contractOwner, config.owner, "contract owner does not match");
  });

  describe('#registerAirline()', function() {
    
    it(`should register second airline`, async function () {
      await config.flightSuretyApp.registerAirline(config.airline2, { from: config.airline1 });
      let isRegisteredAirline = await config.flightSuretyApp.isRegisteredAirline(config.airline2, { from: config.randomUser });
      assert.equal(isRegisteredAirline, true, "New Airline not registered");
    });

    it(`should register third and fourth airline`, async function () {
      await config.flightSuretyApp.registerAirline(config.airline3, { from: config.airline1 });
      await config.flightSuretyApp.registerAirline(config.airline4, { from: config.airline1 });
      let isRegisteredAirline3 = await config.flightSuretyApp.isRegisteredAirline(config.airline3, { from: config.randomUser });
      let isRegisteredAirline4 = await config.flightSuretyApp.isRegisteredAirline(config.airline4, { from: config.randomUser });
      assert.equal(isRegisteredAirline3, true, "Airline3 not registered");
      assert.equal(isRegisteredAirline4, true, "Airline4 not registered");
    });

    it(`should not register fifth airline without consensus`, async function () {
      await config.flightSuretyApp.registerAirline(config.airline5, { from: config.airline1 });
      let isRegisteredAirline5 = await config.flightSuretyApp.isRegisteredAirline(config.airline5, { from: config.randomUser });
      assert.equal(isRegisteredAirline5, false, "Airline5 not registered");
    });

    it(`should not add consensus vote with same airline calling registerAirline`, async function () {
      let reverted = false;
      try{
        await config.flightSuretyApp.registerAirline(config.airline5, { from: config.airline1 });
      }
      catch(e){
        reverted = true;
      }   
      //let multicallsCountAirline5 = await config.flightSuretyApp.getMulticallsCountByAddress(config.airline5, { from: config.airline1 });
      assert.equal(reverted, true, "same airline voted twice");
    });

    it(`should register fifth airline after consensus`, async function () {
      await config.flightSuretyApp.registerAirline(config.airline5, { from: config.airline2 });
      let isRegisteredAirline5 = await config.flightSuretyApp.isRegisteredAirline(config.airline5, { from: config.randomUser });
      assert.equal(isRegisteredAirline5, true, "Airline5 not registered");
    });

    it(`should register sixth airline after 3 airlines voted it in`, async function () {
      await config.flightSuretyApp.registerAirline(config.airline6, { from: config.airline2 });
      await config.flightSuretyApp.registerAirline(config.airline6, { from: config.airline3 });
      let isRegisteredAirline6before = await config.flightSuretyApp.isRegisteredAirline(config.airline6, { from: config.randomUser });
      await config.flightSuretyApp.registerAirline(config.airline6, { from: config.airline4 });
      let isRegisteredAirline6after = await config.flightSuretyApp.isRegisteredAirline(config.airline6, { from: config.randomUser });
      assert.equal(isRegisteredAirline6before, false, "Airline6 registered");
      assert.equal(isRegisteredAirline6after, true, "Airline6 not registered");
    });

  });

  describe('#payRegistrationFee()', function() {

    it(`should pay registration fee properly`, async function () {
      let balanceDataContractBefore = web3.utils.toBN(await web3.eth.getBalance(config.flightSuretyData.address));
      let balanceAirlineBefore = web3.utils.toBN(await web3.eth.getBalance(config.airline2));
      //pay
      await config.flightSuretyApp.payRegistrationFee({ from: config.airline2, value: config.registrationFee });
      let balanceDataContractAfter = web3.utils.toBN(await web3.eth.getBalance(config.flightSuretyData.address));
      let balanceAirlineAfter = web3.utils.toBN(await web3.eth.getBalance(config.airline2));
      console.log("balanceDataContractBefore: "+balanceDataContractBefore)
      console.log("balanceDataContractAfter: "+balanceDataContractAfter)
      console.log("balanceAirlineBefore: "+balanceAirlineBefore)
      console.log("balanceAirlineAfter: "+balanceAirlineAfter)
      let contractCorrectlyPaid = config.registrationFee.toString() === web3.utils.toWei(balanceDataContractAfter, 'ether').toString();
      console.log("web3.utils.toWei(config.registrationFee, 'ether').toString(): "+web3.utils.toWei(config.registrationFee, 'ether').toString())
      console.log("balanceDataContractAfter.toString(): "+web3.utils.toWei(balanceDataContractAfter, 'ether').toString())
      assert.equal(contractCorrectlyPaid, true, "");
    });

  });
});
