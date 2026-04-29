---
name: Autorefresh Application Features
description: A skill for Autorefresh App features
---

## API Endpoint
- for Authententication endpoint please refer to EXPO_PUBLIC_JWT_SCRET in .env file in appandroid directory
- for application endpoint please refer to EXPO_PUBLIC_API_URL in .env file in appandroid directory
- for gmap endpoint please refer to EXPO_PUBLIC_GMAPVIEW_URL in .env file in appandroid directory

## User Management ( Sysadmin role only )
1. User can view, add, edit and delete user
2. Input form field:
   - name ( required )
   - email ( unique | required )
   - password ( required )
   - disabled ( show this field as switch, user can enable or disable the user, default is false )
   - user role ( show this field as dropdown list, user can select user role | required )
3. user can output user list to screen, print to connected print device and share with pdf format to other application

## Transaction Record
1. User press button "Plus" on dashboard for add transaction
2. User directed to camera mode screen to take photo of vehicle, User can continue to take picture and cancel the transaction process
3. After user take picture then the user directed to new transaction input form and show the customer information ( name and phone number which base on plate number if found on database), user can edit the customer information and select the service and payment method, then save the transaction.
4. After save the transaction, system will show the receipt information and user can print or share the receipt.
5. for print receipt, user will direct to print device connected via wifi , user can select the printer and print the receipt
6. for share receipt, user will direct to share the receipt via social media or other application using pdf format
7. Input form field:
   - plate number ( required )
   - select vehicle type ( required )
   - select services ( user can select multiple services ). user will be listed available services and price with checkbox for selection. ( required )
   - Selected services will be listed including the service price
   - Gross Total price will be show
   - Discount (optional)
   - Net Total price will be show
   - payment method ( Credit Card, Cash, Debit Card, Transfer )
8. Database table:
   - transactions (header) : one to many one transaction can have multiple services
   - transaction_services (detail) : one to many (child table)
   User can only pay with only one payment type and do not forget to add List of Value(LOV) for payment type table.

## Branch Management
1. Manage add, edit and delete branch
2. Input form field:
   - branch code ( unique | required )
   - branch name ( unique | required )
   - branch address
   - branch phone
   - branch email
   - branch logo
   - branch latitue ( base on phone location if input device has gps and auto detect if not then leave it null )
   - branch longitude ( base on phone location if input device has gps and auto detect if not then leave it null )
   - branch status ( 1=active, 0=inactive default value is active ) 
3. user can output branch type list to screen, print to connected print device and share with pdf format to other application
4. Database table:
   - branch ( one ) : one branch can have many transaction_services

## Vehicle Type Management
1. View, add, edit and delete vehicle type
2. Input form field:
   - vehicle type code ( unique | required )
   - vehicle type name ( unique | required )
   - vehicle type description
   - vehicle type status ( 1=active, 0=inactive default value is active ) 
3. user can output vehicle type list to screen, print to connected print device and share with pdf format to other application
4. Database table:
   - vehicle_types ( one ) : one vehicle_types can have many service_types

## Service and price Management
1. View, add, edit and delete vehicle type
2. Input form field:
   - select vehicle type (required)
   - service code ( unique | required )
   - service name ( unique | required )
   - service price ( required )
   - service description
   - service status ( 1=active, 0=inactive default value is active ) 
3. user can output service list and price to screen, print to connected print device and share with pdf format to other application
4. Database table:
   - service_types ( one ) : one service_types can have many transaction_services


## Detail Transaction Report ( Filterable by Branch, services, payment method, date period )
1. user can filter transaction report by branch, services, payment method, date period
2. user can view report to screen, print to connected print device and share with pdf format to other application or contact
3. order report by date ascending
4. add option to group by branch, services, payment method and date
5. add sub total for every group
6. add total for all transaction


