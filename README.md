# Neural Wirer
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

Neural Wirer is final project for neural network creation and dataset storing. It allow user to import "csv" files as dataset for later model training.
Other than this, it allow user to create tensorflow based model and let user train and prototype the model in an instance. Lastly, user can browse other users
models and dataset and they can download it and use it as they wish.


This project was built using Django and Django rest framework as backend and JavaScript as frontend language with Reactjs as framework. All dataset and models are saved in database (SQLite by default).


Pages of this project are mobile-responsive


## Installation
First is to clone this repositary

```
$ git clone https://github.com/Jimmy-Tempest/Network-Wirer.git
```

Then change directory in to the cloned repositary

```
$ cd Network-Wirer
```

Then create and activate virtual enviroment for this project
```
$ pip install virtualenv
$ virtualenv venv
$ venv\scripts\activate
```

Then install requirements
```
$ pip install -r requirements.txt
```

Now Create file named `.env` in root of this directory with this content:
```
SECRET_KET = {Your Secret Key Here}
```
Lastly migrate database changes
```
$ python manage.py migrate
```
## Get Started
Everytime you want to start the server run
```
$ venv\scripts\activate
```
Then you can run (optional) to create superuser to access admin dashboard
```
$ python manage.py createsuperuser
```
Finally you can run to start server on http://127.0.0.1:8000
```
$ python manage.py runserver
```
## Files and directories
* `Neural-Wirer` - root application directory
    * `.github` - contain github workflow like api testing
    * `api` - django app that include all api of the project
        * `filters` - directory that include data processing fuction for model training
        * `admin.py` - admin file which I add some admin class and register all my Models
        * `models.py` - include all django model I've used in this project which include "Dataset" model for datasets, "NeuralNetworkModel" model for neural network models and "User" which extends from AbstractUser
        * `serializers.py` - include django rest framework model serializers that all api to convert SQLite data to Javascript Object for it use be used by the frontend
        * `tests.py` - include django unittest of authentication and api calling
        * `urls.py` - include all api urls
        * `views.py` - include all api that this app is based on
    * `capstone` - project directory that django created for us
        * `settings.py` - settings of this project which I've editting to fit the use of rest_framework and scss compiler
        * `urls.py` - file that include all urls of the entire project
    * `frontend` - django app that include all frontend of the project
        * `templates/frontend` - template directory that include html template for the website
            * `index.html` - html file that react render all its component onto
            * `layout.html` - html file that used for including all javascript dependency onto the project 
        * `admin.py` - not editted
        * `models.py` - not editted
        * `tests.py` - not editted
        * `urls.py` - include 1 frontend urls since all routes are managed by javascript
        * `views.py` - include 1 frontend view since all pages are managed by javascript
    * `media_root` - directory that django will created when file is uploaded on to the database
    * `static` - directory that include all static file of this project
        * `admin` - directory that include all static file of django admin app created by running `python manage.py collectstatic`
        * `CACHE` - ditrectory that is created by SASS compiler for saving compiled scss file
        * `frontend` - directory that include all actual static file of project app
            * `css` - directory that include a scss file which is used to style all the page of the project
            * `scripts.js` - script that include all frontend view of this app which run everything user open frontend app which this file include all React component and React router routes which is use to render page and its routes
        * `rest_framework` - directory that include all static file of django rest framework api views `python manage.py collectstatic`
    * `venv` - virtual enviroment created since the installation process
    * `.env` - enviroment variable file you created since the installation process
    * `.gitignore` - git file that tells git to ignore some private file of this project
    * `db.sqlite3` - file that django create to store its models into database
    * `manage.py` - file that is used to run django commands
    * `requirements.txt` - text file that include all python requirements and is used in the installation process


## Distinctiveness and Complexity

## Requirements
### Python Requirements
### Javascripts Requirements