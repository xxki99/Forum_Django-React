# Forum
 Forum made with Python Django REST Framework & React
 
## Installation
 1. Create a new python virtual environment, active the new virtual environment and install dependencies for backend
 
    `python -m venv {"env name"}`
    
    Active the new env
    
    `pip install -r requirements.txt`
    
 2. Install dependencies for frontend
 
    `cd ./forum_frontend`
    
    `npm install`
    
 3. Run the backend server
 
    `python ./forum_backend/manage.py runserver`
    
 4. Change the proxy in forum_frontend/package.json to backend server (default value is "http://localhost:8000/")
    
 5. Run the frontend server
 
    `cd ./forum_frontend`
    
    `npm start`
 
