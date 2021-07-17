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
## Files

## Distinctiveness and Complexity

## Requirements
### Python Requirements
### Javascripts Requirements