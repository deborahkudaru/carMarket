// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "./lib/Events.sol";
import "./lib/Errors.sol";

contract CarDealer is ERC721, Ownable {
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
    ) ERC721("CarNFT", "GLK") Ownable(msg.sender) {
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
            forSale: true,
            previousOwners: new address[](0),
            imageURI: _imageURI
        });

        userCars[msg.sender].push(carId);
        listedCars.push(carId);

        _mint(msg.sender, carId);
        emit Events.CarRegistered(carId, msg.sender);
        emit Events.CarImageUpdated(carId, _imageURI);
    }

    function updateCarImage(
        uint256 _carId,
        string memory _newImageURI
    ) external {
        if (msg.sender != cars[_carId].owner) {
            revert Errors.NotCarOwner();
        }
        require(bytes(_newImageURI).length > 0, "Image URI cannot be empty");

        cars[_carId].imageURI = _newImageURI;
        emit Events.CarImageUpdated(_carId, _newImageURI);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        _requireOwned(tokenId);

        string memory carImageURI = cars[tokenId].imageURI;

        if (bytes(carImageURI).length > 0) {
            return carImageURI;
        } else if (bytes(baseURI).length > 0) {
            return string.concat(baseURI, tokenId.toString());
        } else {
            return "";
        }
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function exists(uint256 tokenId) public view returns (bool) {
        try this.ownerOf(tokenId) {
            return true;
        } catch {
            return false;
        }
    }

    function forSale(uint256 _carId, uint256 _price) external {
        if (msg.sender != cars[_carId].owner) {
            revert Errors.NotCarOwner();
        }
        if (cars[_carId].forSale) {
            revert Errors.CarAlreadyListed();
        }
        require(_price > 0, "Price must be greater than zero");

        cars[_carId].forSale = true;
        cars[_carId].price = _price;

        listedCars.push(_carId);

        emit Events.CarListed(_carId, _price);
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

        _transfer(car.owner, msg.sender, _carId);

        car.previousOwners.push(car.owner);
        carHistory[_carId].push(car.owner);

        car.owner = msg.sender;
        car.seller = payable(msg.sender);

        car.forSale = false;

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
