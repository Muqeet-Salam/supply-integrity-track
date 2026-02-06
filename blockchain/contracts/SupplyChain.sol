// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract SupplyChain is AccessControl {

    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE  = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant RETAILER_ROLE     = keccak256("RETAILER_ROLE");

    struct Batch {
        bytes32 id;
        string name;
        address creator;
        bool exists;
    }

    struct Transfer {
        address from;
        address to;
        uint256 timestamp;
        string location;
    }

    mapping(bytes32 => Batch) public batches;
    mapping(bytes32 => Transfer[]) public transferHistory;

    event BatchCreated(bytes32 batchId);
    event BatchTransferred(bytes32 batchId, address from, address to);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createBatch(bytes32 batchId, string memory name)
        external
        onlyRole(MANUFACTURER_ROLE)
    {
        require(!batches[batchId].exists, "Batch already exists");

        batches[batchId] = Batch(
            batchId,
            name,
            msg.sender,
            true
        );

        emit BatchCreated(batchId);
    }

    function transferBatch(
        bytes32 batchId,
        address to,
        string memory location
    ) external {
        require(batches[batchId].exists, "Invalid batch");

        transferHistory[batchId].push(
            Transfer(msg.sender, to, block.timestamp, location)
        );

        emit BatchTransferred(batchId, msg.sender, to);
    }

    function getTransfers(bytes32 batchId)
        external
        view
        returns (Transfer[] memory)
    {
        return transferHistory[batchId];
    }
}
