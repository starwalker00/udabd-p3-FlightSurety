pragma solidity ^0.4.25;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";

contract FlightSuretyData {
    using SafeMath for uint256;

    /********************************************************************************************/
    /*                                       DATA VARIABLES                                     */
    /********************************************************************************************/

    address public contractOwner;                                      // Account used to deploy contract
    bool public operational = true;                                    // Blocks all state changes throughout the contract if false
    
    // Airlines
    struct Airline {
        uint256 number;
        bool hasPaidRegistrationFee;
    }
    mapping(address => Airline) public airlines;
    uint256 airlineCount;

    // Authorized callers
    mapping (address => bool) public authorizedCallers;

    /********************************************************************************************/
    /*                                       EVENT DEFINITIONS                                  */
    /********************************************************************************************/


    /**
    * @dev Constructor
    *      The deploying account becomes contractOwner
    */
    constructor()
    public 
    {
        contractOwner = msg.sender;
        airlineCount = 0;

        // register owner as airline
        airlineCount = airlineCount.add(1);
        airlines[contractOwner].number = airlineCount;
    }

    /********************************************************************************************/
    /*                                       FUNCTION MODIFIERS                                 */
    /********************************************************************************************/

    // Modifiers help avoid duplication of code. They are typically used to validate something
    // before a function is allowed to be executed.

    /**
    * @dev Modifier that requires the "operational" boolean variable to be "true"
    *      This is used on all state changing functions to pause the contract in 
    *      the event there is an issue that needs to be fixed
    */
    modifier requireIsOperational() 
    {
        require(operational, "Contract is currently not operational");
        _;  // All modifiers require an "_" which indicates where the function body will be added
    }

    /**
    * @dev Modifier that requires the "ContractOwner" account to be the function caller
    */
    modifier requireContractOwner()
    {
        require(msg.sender == contractOwner, "Caller is not contract owner");
        _;
    }

    /********************************************************************************************/
    /*                                       UTILITY FUNCTIONS                                  */
    /********************************************************************************************/

    function addAuthorizedCaller(address callerToAuthorize)
    public
    view
    requireContractOwner()
    {
        //return airlines.length;
        authorizedCallers[callerToAuthorize] = true;
    }

    function getAirlineCount()
    public
    view
    returns(uint256)
    {
        //return airlines.length;
        return airlineCount;
    }

    function isRegisteredAirline(address potentialAirlineAddress)
    public
    view
    returns(bool)
    {
        return airlines[potentialAirlineAddress].number != 0;
    }

    function airlineHasPaidRegistrationFee(address airlineAddress)
    public
    view
    returns(bool)
    {
        return airlines[airlineAddress].hasPaidRegistrationFee;
    }

    /**
    * @dev Get operating status of contract
    *
    * @return A bool that is the current operating status
    */      
    function isOperational() 
                            public 
                            view 
                            returns(bool) 
    {
        return operational;
    }


    /**
    * @dev Sets contract operations on/off
    *
    * When operational mode is disabled, all write transactions except for this one will fail
    */    
    function setOperatingStatus
                            (
                                bool mode
                            ) 
                            external
                            requireContractOwner 
    {
        operational = mode;
    }

    /********************************************************************************************/
    /*                                     SMART CONTRACT FUNCTIONS                             */
    /********************************************************************************************/

   /**
    * @dev Add an airline to the registration queue
    *      Can only be called from FlightSuretyApp contract
    *
    */   
    function registerAirline(address airlineToRegister)
    public
    {
        uint256 airlineNumber = airlineCount.add(1);
        airlines[airlineToRegister].number = airlineNumber;
        airlineCount = airlineCount.add(1);
    }

    function setAirlineHasPaidRegistrationFee(address airlinePayingRegistrationFee) 
    public
    {
        airlines[airlinePayingRegistrationFee].hasPaidRegistrationFee = true;
    }

   /**
    * @dev Buy insurance for a flight
    *
    */   
    function buy
                            (                             
                            )
                            external
                            payable
    {

    }

    /**
     *  @dev Credits payouts to insurees
    */
    function creditInsurees
                                (
                                )
                                external
                                pure
    {
    }
    

    /**
     *  @dev Transfers eligible payout funds to insuree
     *
    */
    function pay
                            (
                            )
                            external
                            pure
    {
    }

   /**
    * @dev Initial funding for the insurance. Unless there are too many delayed flights
    *      resulting in insurance payouts, the contract should be self-sustaining
    *
    */   
    function fund
                            (   
                            )
                            public
                            payable
    {
    }

    function getFlightKey
                        (
                            address airline,
                            string memory flight,
                            uint256 timestamp
                        )
                        pure
                        internal
                        returns(bytes32) 
    {
        return keccak256(abi.encodePacked(airline, flight, timestamp));
    }

    /**
    * @dev Fallback function for funding smart contract.
    *
    */
    function() 
                            external 
                            payable 
    {
        fund();
    }


}

