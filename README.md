# MY FAVORITES APPLICATION

### BY VERONICA FERNANDEZ-DIAZ

## Project Description

This project will demonstrate how to build an application that collects a user's favorites.

## Installation Process

1. Choose a built tool and server such as using Vite with a React template
2. Create a new repository in Github
3. Clone the repository locally
4. Begin installation process of Vite using your command line interface by typing "npm create@latest . -- --template react"
5. Install with command "npm install"
6. Run the development server with the command "npm run dev"
7. Open a browser to the local link noted in the command line interface
8. In order to save your responses, you can connect the project to an Airtable base.
   a. Create an environment file .env.local in the base directory of the project and copy contents from file env.local.example. As you go through the setup and documentation, you'll save those for the project's use.
9. Set up the Airtable.
   a. Sign up for a free Airtable account
   b. Create a table from scratch
   c. Rename base as "All Favorites" and the table as "Favorites"
   d. Save the table name "Favorites" to your environment file under the variable VITE_TABLE_NAME
   e. Rename the first field/column name to "title" and delete the other fields
   f. Create a new single line text field named "category"
   g. Create a number field using 0 decimal places and name it "order"
   h. Click on the profile to open the menu and select "Builder Hub"
   i. Select "Create new token"
   j. Enter a name that you will remember
   k. Click "Add add scope" and add the scopes data.records.read and data.records.write
   l. Click "Add a base" and choose the "All Favorites" base
   m. Click "Create token" and copy the token that appears
   n. Save the token to VITE_PAT in your environment file
   o.Find the base's id by returning to the table, clicking the "Help" icon and opening the API documentation
   p. In the API documentation, you can find ID and then save it to VITE_BASE_ID
10. Install Babel plugin, using the terminal
    a. Enter: npm install --save-dev babel-plugin-styled-component
    b. The plugin should already be registered inside the vite.config.js file on this project
11. Install React-Router, using the terminal
    a. Enter: npm install react-router@~7.2.0
    b. In main.jsx, the App instance should already be wrapped with BrowserWrapper imported from react-router

## Dependencies

- react-router: Routing and navigation
- styled-components: Styling with CSS
- babel-plugin-styled-components: Create readable class names and help with troubleshooting
- Airtable: External API to save data
