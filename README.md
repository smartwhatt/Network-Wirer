# Neural Wirer
[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/Jimmy-Tempest/Network-Wirer/blob/master/LICENSEs)

Neural Wirer is the cs50 web final project for neural network creation and dataset storing. It allows users to import "CSV" files as datasets for later model training.
Other than this, it allows users to create a TensorFlow-based model and let users train and prototype the model in an instance. Lastly, users can browse other users
models and dataset and they can download it and use it as they wish.


This project was built using Django and Django rest framework as backend and JavaScript as frontend language with Reactjs as the framework. All datasets and models are saved in the database (SQLite by default).


Pages of this project are mobile-responsive


## Installation
The first is to clone this repository

```
$ git clone https://github.com/Jimmy-Tempest/Network-Wirer.git
```

Then change the directory into the cloned repository

```
$ cd Network-Wirer
```

Then create and activate virtual environment for this project
```
$ pip install virtualenv
$ virtualenv venv
$ venv\scripts\activate
```

Then install requirements
```
$ pip install -r requirements.txt
```

Now create a file named `.env` in the root of this directory with this content:
```
SECRET_KET = {Your Secret Key Here}
```
Lastly, migrate database changes
```
$ python manage.py migrate
```
## Get Started
Every time you want to start the server run
```
$ venv\scripts\activate
```
Then you can run (optional) to create a superuser to access the admin dashboard
```
$ python manage.py createsuperuser
```
Finally, you can run to start the server on http://127.0.0.1:8000
```
$ python manage.py runserver
```
## Files and directories
* `Neural-Wirer` - root application directory
    * `.github` - contain GitHub workflow like API testing
    * `api` - Django app that includes all API of the project
        * `filters` - directory that includes data processing function for model training
        * `admin.py` - admin file which I add some admin classes and register all my Models
        * `models.py` - include all Django models I've used in this project which includes the "Dataset" model for datasets, "NeuralNetworkModel" model for neural network models, and "User" which extends from AbstractUser
        * `serializers.py` - include Django rest framework model serializers that all API to convert SQLite data to Javascript Object for its use be used by the frontend
        * `tests.py` - include Django unit test of authentication and API calls
        * `urls.py` - include all api urls
        * `views.py` - include all API that this app is based on
    * `capstone` - project directory that Django created for us
        * `settings.py` - settings of this project which I've editing to fit the use of rest_framework and scss compiler
        * `urls.py` - a file that includes all URLs of the entire project
    * `frontend` - Django app that includess all frontend of the project
        * `templates/frontend` - template directory that includes HTML template for the website
            * `index.html` - HTML file that react render all its component onto
            * `layout.html` - HTML file that used for including all javascript dependency onto the project 
        * `admin.py` - not editted
        * `models.py` - not editted
        * `tests.py` - not editted
        * `urls.py` - include 1 frontend URL since all routes are managed by javascript
        * `views.py` - include 1 frontend view since all pages are managed by javascript
    * `media_root` - directory that Django will create when the file is uploaded onto includes the database
    * `static` - directory that includes all static files of this project
        * `admin` - directory that includes all static files of Django admin app created by running `python manage.py collectstatic`
        * `CACHE` - directory that is created by SASS compiler for saving compiled scss file
        * `frontend` - directory that includes all actual static files of the project app
            * `css` - directory that includes an scss file which is used to style all the pages of the project
            * `scripts.js` - script that includes all frontend views of this app which run everything user open frontend app which this file include all React component and React router routes which are used to render the page and its routes
        * `rest_framework` - directory that includes all static files of Django rest framework API views `python manage.py collectstatic`
    * `venv` - a virtual environment created since the installation process
    * `.env` - environment variable file you created since the installation process
    * `.gitignore` - git file that tells git to ignore some private file of this project
    * `db.sqlite3` - the file that Django create to store its models into database
    * `manage.py` - the file that is used to run Django commands
    * `requirements.txt` - a text file that includes all python requirements and is used in the installation process


## Distinctiveness and Complexity
### Distinctiveness
This project is a web application that allows users to store a dataset and use it to create the model and train it on the web which is not only on its own distinct from any other project in this course and also does not exist anywhere else on the internet. As of today, most neural network website depends on its use to pre-made their models and dataset then send it to its service to just train but this project allows the user to create their model on the fly here and import their dataset or use ones that other users create to train their model here. 
### Complexity
This project includes all aspects I've learned from CS50 web development with python and javascript which includes Django, SQLite, HTML5, CSS, SASS, Javascript, React, CL/CD, and APIs. Other than that, I've included other technologies like React Router, Django Rest Framework, Tensorflow, etc. This introduces Complexity in file management, API calls, Model Serializing, and data management as a whole. Also, this project largely relies on files and data conversion since Django, python Tensorflow, and Tensorflow.js do not use the same data types not accounting pandas which is a python library for data science which data have to be converted and visualized by React which use Javascript language. In the end, I managed to link all those data together to process and show it on a nice front end.
## Requirements
This project depends on multiple open-source libraries in both python and javascript part of the project
### Python Requirements
* Django-compressor and Django-libsass - this library is used by the frontend to compile SASS style sheets and use it as it is without the developer to manually compile it
* djangorestframework - this module is used by API app to use as utilities to serialize and deliver JSON objects to the corresponding request it also includes security when it comes to serializing and deserializing input from frontend
* NumPy - python library for managing arrays which are used in process of model training
* pandas - python data science module which is necessary for importing and saving datasets and processing it
* sklearn - machine learning module which in this project is used for data preprocessing for the training in api/filters/filters.py
* TensorFlow - deep learning module which is the core library of this project which is used for model training
* Tensorflowjs - python API for python TensorFlow to communicate with Tensorflowjs in javascript 
### Javascripts Requirements
* React - Javascript framework which is core to developing frontend UI for this project
* ReactDOM - Javascript library which is used for rendering React Component to the Document Object model
* React Router - Javascript library that is used for routes management with React Component and the Web to remain 1 page
* Tensorflowjs - Javascript implementation of TensorFlow which is used for model building on the client-side to be sent to the API to be saved trained
* Chartjs - Javascript library that is used for visualizing training process and other data

