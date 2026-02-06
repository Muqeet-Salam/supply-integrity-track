// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SupplyChain {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/
    error NotManufacturer();
    error NotSupplier();
    error InvalidBatch();
    error InvalidStatusTransition();

    /*//////////////////////////////////////////////////////////////
                                ENUMS
    //////////////////////////////////////////////////////////////*/
    enum Status {
        Manufactured,
        ReadyForSale
    }

    /*//////////////////////////////////////////////////////////////
                                STRUCTS
    //////////////////////////////////////////////////////////////*/
    struct Batch {
        uint256 batchId;
        string productName;
        address manufacturer;
        address supplier;
        Status status;
        uint256 timestamp;
    }

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint256 private nextBatchId;

    mapping(uint256 => Batch) private batches;

    mapping(address => bool) public manufacturers;
    mapping(address => bool) public suppliers;

    address public owner;

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/
    event ManufacturerAdded(address indexed manufacturer);
    event SupplierAdded(address indexed supplier);

    event BatchCreated(
        uint256 indexed batchId,
        string productName,
        address indexed manufacturer,
        uint256 timestamp
    );

    event StatusUpdated(
        uint256 indexed batchId,
        Status newStatus,
        address indexed updatedBy,
        uint256 timestamp
    );

    /*//////////////////////////////////////////////////////////////
                                MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyManufacturer() {
        if (!manufacturers[msg.sender]) revert NotManufacturer();
        _;
    }

    modifier onlySupplier() {
        if (!suppliers[msg.sender]) revert NotSupplier();
        _;
    }

    modifier validBatch(uint256 _batchId) {
        if (_batchId >= nextBatchId) revert InvalidBatch();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor() {
        owner = msg.sender;
        manufacturers[msg.sender] = true;
        emit ManufacturerAdded(msg.sender);
    }

    /*//////////////////////////////////////////////////////////////
                            ROLE MANAGEMENT
    //////////////////////////////////////////////////////////////*/
    function addManufacturer(address _manufacturer) external onlyOwner {
        manufacturers[_manufacturer] = true;
        emit ManufacturerAdded(_manufacturer);
    }

    function addSupplier(address _supplier) external onlyOwner {
        suppliers[_supplier] = true;
        emit SupplierAdded(_supplier);
    }

    /*//////////////////////////////////////////////////////////////
                        MANUFACTURER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function createBatch(string calldata _productName)
        external
        onlyManufacturer
        returns (uint256)
    {
        uint256 batchId = nextBatchId++;

        batches[batchId] = Batch({
            batchId: batchId,
            productName: _productName,
            manufacturer: msg.sender,
            supplier: address(0),
            status: Status.Manufactured,
            timestamp: block.timestamp
        });

        emit BatchCreated(
            batchId,
            _productName,
            msg.sender,
            block.timestamp
        );

        return batchId;
    }

    /*//////////////////////////////////////////////////////////////
                        SUPPLIER FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    function markReadyForSale(uint256 _batchId)
        external
        onlySupplier
        validBatch(_batchId)
    {
        Batch storage batch = batches[_batchId];

        if (batch.status != Status.Manufactured) {
            revert InvalidStatusTransition();
        }

        batch.status = Status.ReadyForSale;
        batch.supplier = msg.sender;
        batch.timestamp = block.timestamp;

        emit StatusUpdated(
            _batchId,
            Status.ReadyForSale,
            msg.sender,
            block.timestamp
        );
    }

    /*//////////////////////////////////////////////////////////////
                        VIEW FUNCTIONS (CONSUMER)
    //////////////////////////////////////////////////////////////*/
    function getBatch(uint256 _batchId)
        external
        view
        validBatch(_batchId)
        returns (Batch memory)
    {
        return batches[_batchId];
    }

    function getCurrentBatchId() external view returns (uint256) {
        return nextBatchId;
    }
}
