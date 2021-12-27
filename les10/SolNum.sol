// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

/**
 * @dev ������ � ��������� �����������
 * @title SolNum
 */
contract SolNum {

    uint savedValue;
    uint8 smallInt;

    /**
     * @dev ���������� �������� uint � ����������
     * @param newValue ����� ��������
     */
    function setValue( uint newValue ) public {
        savedValue = newValue;
    }

    /**
     * @dev ������ �������� ���������� newValue
     * @return �������� ���������� newValue
     */
    function getValue() public view returns( uint ) {
        return savedValue;
    }

    /**
     * @dev ���������� �������� uint8 � ���������� � ���������� �������� �� 1
     * @param newSmallValue ����� ��������
     */

    function setSmallInt( uint8 newSmallValue) public {
        smallInt = newSmallValue;
        smallInt += 1;
    }

    /**
     * @dev ������ �������� ���������� smallInt
     * @return �������� ���������� smallInt
     */
    function getSmallInt() public view returns( uint8 ) {
        return smallInt;
    }
}