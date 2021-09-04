
var Test = require('../config/testConfig.js');
var BigNumber = require('bignumber.js');

contract('Flight Surety Tests', async (accounts) => {

  var config;
  before('setup FlightSuretyData contract', async () => {
    config = await Test.Config(accounts);
  });

  it(`verifies contract owner`, async function () {
    console.log("from: config.owner: "+ config.owner)
    console.log("from: config.randomUser: "+ config.randomUser)
    let contractOwner = await config.flightSuretyData.contractOwner({ from: config.randomUser });
    assert.equal(contractOwner, config.owner, "contract owner does not match");
  });

  it(`verifies getAirlineCount`, async function () {
    let airlineCount = await config.flightSuretyData.getAirlineCount({ from: config.randomUser });
    assert.equal(airlineCount, 1, "getAirlineCount");
  });

  it(`verifies isRegisteredAirline:true`, async function () {
    let isRegistered = await config.flightSuretyData.isRegisteredAirline(config.owner, { from: config.randomUser });
    assert.equal(isRegistered, true, "isRegisteredAirline:true");
  });

  it(`verifies isRegisteredAirline:false`, async function () {
    let isRegistered = await config.flightSuretyData.isRegisteredAirline(config.airline2, { from: config.randomUser });
    assert.equal(isRegistered, false, "isRegisteredAirline:false");
  });

  it(`verifies registeredAirline`, async function () {
    await config.flightSuretyData.registerAirline(config.airline2, { from: config.airline1 });
    let isRegistered = await config.flightSuretyData.isRegisteredAirline(config.airline2, { from: config.randomUser });
    assert.equal(isRegistered, true, "registeredAirline");
  });

  it(`verifies getAirlineCount`, async function () {
    let airlineCount = await config.flightSuretyData.getAirlineCount({ from: config.randomUser });
    assert.equal(airlineCount, 2, "getAirlineCount");
  });
  
});
