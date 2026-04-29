---
name: Autorefresh Application Specification
description: A skill for develope Autorefresh App to manage car wash transaction.
---

## Overview
Autorefresh is a car wash transaction management system. This app have 3 interface
1. Admin interface for admin staff to tracking and record transaction.
2. Owner interface for manager or owner to tracking transaction and branch information. Owner interface also manage services and price.
3. sysadmin interface for system admin to managing all the system including branches, users, roles, permissions, services, prices, etc.
4. Both Admin and Owner interface run in same application base on React Native Expo base on user roles when login.

## Features
1. Login Base on selected branch and user role ( Auth Service already create, just login and get the JWT Token. do not create or modify existing Auth Service )
2. Transaction Record ( base on selected branch on logged-in ) 
3. Detail Transaction Report ( Filterable by Branch, services, payment method, date period )
4. Summary Transaction Report ( Filterable by Branch, services, payment method, date period )
5. Service and price Management
6. Branch Management
7. User Management

## Interface
1. Admin Interface
2. Owner Interface
3. Sysadmin Interface

## Application Architecture
This is a microservices base architecture 
1. Auth Service ( JWT Authentication & Authorization ) using RESTAPI base on Spring Boot  ( Auth Service already created in directory authapi in this project root, just login and get the JWT Token )
2. Application Service using RESTAPI base on Larave 5.8 ( do not create from scratch, the base template already created in in directory appapi in this project root, just learn and analyze the template and add new function for car wash application )
3. Frontend Admin interface and Owner Interface using React Native Expo ( do not create from scratch, the base template already created in in directory appandroid in this project root, just learn and analyze the template and add new function for car wash application )

## Development Steps
1. Analyze all the code base in authapi directory 
2. Analyze all the code base in appapi directory and use existing composer.json config only add new package if needed
3. Analyze all the code base in appandroid directory use existing package.json config only add new package if needed
4. Understand the application flow 
5. Add new function for car wash application

## Development Tech Stack
1. Backend: PHP Laravel 5.8
2. Database: MySQL
3. Frontend: React Native Expo

## UIUX for Android or iOS ( must compatible with both ): base on appandroid directory
1. Responsive design ( must compatible with android and ios )
2. Must Responsive, rotateable, Compatible and readable for any device size and orientaion portrait/landscape ( tablet and phone )
3. use the tailwindcss base design for all the UI component
4. use the material icons for all icon (https://fonts.google.com/icons)
5. use the shadow base on shadow-md (https://tailwindcss.com/docs/box-shadow)
6. use the border base on border-2 (https://tailwindcss.com/docs/border-radius)
7. create application icon and logo
8. create splash screen
9. add dark mode and light mode


