# Forum
 Forum made with Python Django REST Framework & React
 
## Installation
Clone this repo

`git clone https://github.com/xxki99/Forum_Django-React`

Open your terminal and change directory to Forum_Django-React

`cd ./Forum_Django-React`

## Setup

 1. Create a new python virtual environment, active the new virtual environment and install dependencies for backend
 
    1.1 Create a new virtual environment: 
    
    `python -m venv {"env name"}`
    
    1.2 Activate environment
    
     - (On windows): `{your env path}\Scripts\activate`
     
     - (On Linux): `source {your env path}/bin/activate`
    
    
    
    1.3 Install dependencies for backend (requirements.txt is located at Forum_Django-React/forum_backend)
    
    `pip install -r ./forum_backend/requirements.txt`
 
 2. Create backend database

    `python ./forum_backend/manage.py migrate`
    
 3. Run the backend server
 
    `python ./forum_backend/manage.py runserver`
    
 4. Open a new terminal and change directory to forum_frontend and then install dependencies for frontend
 
    `cd ./forum_frontend`
    
    `npm install`
    

    
 5. Change the proxy in forum_frontend/package.json to backend server (default value is "http://localhost:8000/")
 
 
    
 6. Run the frontend server inside ./forum_frontend
    
    `npm start`

## TODO
-  [ ] Handle frontend input error: write post and write comment
-  [ ] Add change thread function to frontend
-  [ ] Add page function to frontend
-  [ ] Add reply comment on comment to both backend and frontend
-  [ ] Add refresh button to thread nav and post viewer
 
