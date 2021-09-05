import FlightSuretyApp from '../../build/contracts/FlightSuretyApp.json';
import Config from './config.json';
import Web3 from 'web3';

export default class Contract {
    constructor(network, callback) {

        let config = Config[network];
        this.web3 = new Web3(new Web3.providers.HttpProvider(config.url));
        this.flightSuretyApp = new this.web3.eth.Contract(FlightSuretyApp.abi, config.appAddress);
        this.initialize(callback);
        this.owner = null;
        this.airlines = [];
        this.passengers = [];
    }

    initialize(callback) {
        this.web3.eth.getAccounts((error, accts) => {
           
            this.owner = accts[0];

            let counter = 1;
            
            while(this.airlines.length < 5) {
                this.airlines.push(accts[counter++]);
            }

            while(this.passengers.length < 5) {
                this.passengers.push(accts[counter++]);
            }

            callback();
        });
    }

    isOperational(callback) {
       let self = this;
       self.flightSuretyApp.methods
            .isOperational()
            .call({ from: self.owner}, callback);
    }

    airlineCount(callback) {
        let self = this;
        self.flightSuretyApp.methods
             .getAirlineCount()
             .call({ from: self.owner}, callback);
     }

    fetchFlightStatus(flight, callback) {
        let self = this;
        let payload = {
            airline: self.airlines[0],
            flight: flight,
            timestamp: Math.floor(Date.now() / 1000)
        } 
        self.flightSuretyApp.methods
            .fetchFlightStatus(payload.airline, payload.flight, payload.timestamp)
            .send({ from: self.owner}, (error, result) => {
                callback(error, payload);
            });
    }

    isRegisteredAirline(airlineAddress, callback) {
        let self = this;
        let payload = {
            airlineAddress: airlineAddress,
        } 
        console.log("airlineAddress:"+payload.airlineAddress)
        self.flightSuretyApp.methods
            .isRegisteredAirline(payload.airlineAddress)
            .call({ from: self.owner}, callback);
    }

    registerAirline(airlineAddress,airlineAddressCaller, callback) {
        let self = this;
        let payload = {
            airlineAddress: airlineAddress,
        } 
        console.log("airlineAddress:"+payload.airlineAddress)
        console.log("sender: "+airlineAddressCaller)
        self.flightSuretyApp.methods
            .registerAirline(payload.airlineAddress)
            .send({ from: airlineAddressCaller }, (error, result) => {
                callback(error, payload);
            });
    }
}