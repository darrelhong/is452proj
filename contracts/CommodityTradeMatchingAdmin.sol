// SPDX-License-Identifier: MIT 
pragma solidity >=0.7.0 <0.9.0;

import "./CommodityTradeMatching.sol"; 
contract CommodityTradeMatchingAdmin { 
event CreateLog(address addr); 
function create( 
        address buyer, 
        address seller, 
        uint256 expectedDateOfTrade, 
        string memory commodityCategory, 
        string memory commodityType, 
        uint256 commodityPrice, 
        uint256 commodityUnit 
    ) public {  
        CommodityTradeMatching commodTradeMatching = new CommodityTradeMatching(buyer,seller,expectedDateOfTrade,commodityCategory, commodityType,commodityPrice,commodityUnit); 
        emit CreateLog(address(commodTradeMatching)); 
    } 
}