// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract CommodityTradeMatching {
    // Definte Smart Contract Variables
    address private buyer;
    address private seller;
    uint256 private expectedDateOfTrade;
    // Category of Commodity: Agricultural, Energy, Metals
    string private commodityCategory;
    // Type of Commodity:
    //    Agricultural --> Cattle, Lumber, Soya Bean
    //    Energy --> Coal, Crude Oil, Gasoline, Heating Oil, Natural Gas
    //    Metals --> Aluminum, Copper, Gold, Nickel, Palladium, Platium, Silver, Steel, Zinc
    string private commodityType;
    // CommodityPrice is assumed to be in ethers
    uint256 private commodityPrice;
    uint256 private commodityUnit;

    mapping(address => uint256) balances;

    enum Status {
        Open,
        InNegotiation,
        Approved,
        Rejected,
        Paid,
        PaymentVerified
    }

    Status private tradeStatus;

    event StatusChanged(
        Status previousStatus,
        Status newStatus,
        uint256 timestamp
    );

    constructor(
        address buyerAddress,
        address sellerAddress,
        uint256 _expectedDateOfTrade,
        string memory _commodityCategory,
        string memory _commodityType,
        uint256 _commodityPrice,
        uint256 _commodityUnit
    ) {
        require(
            tx.origin == buyerAddress || tx.origin == sellerAddress,
            "Only Seller/Dealer can submit the Commodity Type, Ask Price and Quantity Available"
        );
        buyer = buyerAddress;
        seller = sellerAddress;
        expectedDateOfTrade = _expectedDateOfTrade;
        commodityCategory = _commodityCategory;
        commodityType = _commodityType;
        commodityPrice = _commodityPrice;
        commodityUnit = _commodityUnit;
        tradeStatus = Status.Open;
    }

    function getInfo()
        public
        view
        returns (
            address buyerAddress,
            address sellerAddress,
            uint256 _expectedDateOfTrade,
            string memory _commodityCategory,
            string memory _commodityType,
            uint256 _commodityPrice,
            uint256 _commodityUnit,
            Status _tradeStatus
        )
    {
        return (
            buyer,
            seller,
            expectedDateOfTrade,
            commodityCategory,
            commodityType,
            commodityPrice,
            commodityUnit,
            tradeStatus
        );
    }

    function amount() public view returns (uint256) {
        // amount_to_pay is in ethers
        uint256 amount_to_pay = uint256(commodityPrice) *
            uint256(commodityUnit) *
            1000000000000000000;
        return amount_to_pay;
    }

    function inNegotiation() public {
        // Only Buyer can accept the open trade and change the status to in-negotiation with the Seller
        require(
            msg.sender == buyer,
            "Only buyer can set the trade to in-negotiation"
        );
        // Only in-negotiation can be Approved
        require(tradeStatus == Status.Open, "Trade not in Open status");
        Status previousStatus = tradeStatus;
        tradeStatus = Status.InNegotiation;
        emit StatusChanged(previousStatus, tradeStatus, block.timestamp);
    }

    function approve() public {
        // Only the seller can approve the trade negotiation.
        require(msg.sender == seller, "Only seller can approve the trade");
        // Only in-negotiation can be Approved
        require(
            tradeStatus == Status.InNegotiation,
            "Trade not in negotiation status"
        );
        Status previousStatus = tradeStatus;
        tradeStatus = Status.Approved;
        emit StatusChanged(previousStatus, tradeStatus, block.timestamp);
    }

    function reject() public {
        // Only the seller can reject the trade negotiation.
        require(msg.sender == seller, "Only seller can reject the trade");
        // Only in-negotiation can be Rejected
        require(
            tradeStatus == Status.InNegotiation,
            "Trade not in negotiation status"
        );
        Status previousStatus = tradeStatus;
        tradeStatus = Status.Rejected;
        emit StatusChanged(previousStatus, tradeStatus, block.timestamp);
    }

    function paymentToContract() public payable {
        require(msg.sender == buyer, "Only buyer can pay");
        require(
            tradeStatus == Status.Approved,
            "Only approved orders can be Paid"
        );
        require(msg.value == amount(), "Payment must be in correct amount");
        Status previousStatus = tradeStatus;
        tradeStatus = Status.Paid;
        emit StatusChanged(previousStatus, tradeStatus, block.timestamp);
        balances[msg.sender] += msg.value;
    }

    function contractValue() public view returns (uint256) {
        return address(this).balance;
    }

    function withdrawMoney() public {
        address payable to = payable(msg.sender);
        require(msg.sender == seller, "Only seller can receive payment");
        to.transfer(contractValue());
    }

    function paymentVerified() public {
        // Only the seller can set status to paid for the trade negotiation.
        require(
            msg.sender == seller,
            "Only seller can set paid Status for the trade"
        );
        // Only Approved negotiations can be set to paid
        require(tradeStatus == Status.Paid, "Trade not yet paid");
        Status previousStatus = tradeStatus;
        tradeStatus = Status.PaymentVerified;
        emit StatusChanged(previousStatus, tradeStatus, block.timestamp);
    }
}
