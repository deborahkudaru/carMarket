// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./lib/Events.sol";
import "./lib/Errors.sol";

contract CarDealer is Ownable {
    using Strings for uint256;

    struct Car {
        uint256 id;
        string model;
        string color;
        uint256 price;
        address owner;
        address payable seller;
        bool forSale;
        address[] previousOwners;
        string imageURI;
    }

    uint256 private nextCarID;
    mapping(uint256 => Car) public cars;
    mapping(uint256 => address[]) public carHistory;
    mapping(address => uint256[]) private userCars;
    uint256[] private listedCars;
    string private baseURI;

    constructor(
        string memory _baseURI
    ) Ownable(msg.sender) {
        baseURI = _baseURI;
    }

    function registerCar(
        string memory _model,
        string memory _color,
        uint256 _price,
        string memory _imageURI
    ) external {
        require(bytes(_model).length > 0, "Model cannot be empty");
        require(bytes(_color).length > 0, "Color cannot be empty");
        require(_price > 0, "Price must be greater than zero");

        uint256 carId = nextCarID++;
        cars[carId] = Car({
            id: carId,
            model: _model,
            color: _color,
            price: _price,
            owner: msg.sender,
            seller: payable(msg.sender),
            forSale: true,  // Car is automatically for sale
            previousOwners: new address[](0),
            imageURI: _imageURI
        });

        userCars[msg.sender].push(carId);
        listedCars.push(carId);  // Add to listed cars immediately

        emit Events.CarRegistered(carId, msg.sender);
        emit Events.CarImageUpdated(carId, _imageURI);
        emit Events.CarListed(carId, _price);  // Emit listing event
    }

    function getCarImageURI(uint256 carId) public view returns (string memory) {
        string memory carImageURI = cars[carId].imageURI;

        if (bytes(carImageURI).length > 0) {
            return carImageURI;
        } else if (bytes(baseURI).length > 0) {
            return string.concat(baseURI, Strings.toString(carId));
        } else {
            return "";
        }
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function buyCar(uint256 _carId) external payable {
        Car storage car = cars[_carId];
        if (!car.forSale) {
            revert Errors.CarNotForSale();
        }
        if (msg.value < car.price) {
            revert Errors.InsufficientFunds();
        }

        car.seller.transfer(msg.value);

        car.previousOwners.push(car.owner);
        carHistory[_carId].push(car.owner);

        car.owner = msg.sender;
        car.seller = payable(msg.sender);

        car.forSale = false;

        // Remove from listedCars array
        for (uint256 i = 0; i < listedCars.length; i++) {
            if (listedCars[i] == _carId) {
                listedCars[i] = listedCars[listedCars.length - 1];
                listedCars.pop();
                break;
            }
        }

        userCars[msg.sender].push(_carId);
        emit Events.CarSold(_carId, msg.sender, msg.value);
    }

    function getCarsForSale() external view returns (Car[] memory) {
        Car[] memory saleCars = new Car[](listedCars.length);
        for (uint256 i = 0; i < listedCars.length; i++) {
            saleCars[i] = cars[listedCars[i]];
        }
        return saleCars;
    }

    function getMyCars() external view returns (Car[] memory) {
        uint256[] storage myCarIds = userCars[msg.sender];
        Car[] memory myCars = new Car[](myCarIds.length);
        for (uint256 i = 0; i < myCarIds.length; i++) {
            uint256 carId = myCarIds[i];
            if (cars[carId].owner == msg.sender) {
                myCars[i] = cars[carId];
            }
        }
        return myCars;
    }

    function getCarHistory(
        uint256 _carId
    ) external view returns (address[] memory) {
        return carHistory[_carId];
    }

    function getCar(uint256 _carId) external view returns (Car memory) {
        return cars[_carId];
    }
}