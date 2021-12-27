// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @dev Работа с числовыми переменными
 * @title SolNum
 */
contract SolNum {

    uint savedValue;
    uint8 smallInt;

    /**
     * @dev Сохранение значения uint в переменной
     * @param newValue Новое значение
     */
    function setValue( uint newValue ) public {
        savedValue = newValue;
    }

    /**
     * @dev Чтение значения переменной newValue
     * @return Значение переменной newValue
     */
    function getValue() public view returns( uint ) {
        return savedValue;
    }

    /**
     * @dev Сохранение значения uint8 в переменной и увеличение значения на 1
     * @param newSmallValue Новое значение
     */

    function setSmallInt( uint8 newSmallValue) public {
        smallInt = newSmallValue;
        smallInt += 1;
    }

    /**
     * @dev Чтение значения переменной smallInt
     * @return Значение переменной smallInt
     */
    function getSmallInt() public view returns( uint8 ) {
        return smallInt;
    }
}