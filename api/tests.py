from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
import csv
import os
# Create your tests here.


class AuthenticationAPITestCase(APITestCase):
    def csrftoken_test(self):
        response = self.client.get("/api/set-csrf")
        csrftoken = response.cookies["csrftoken"]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertContains(response.cookies["csrftoken"])

    def test_authentication(self):
        response = self.client.get("/api/set-csrf")
        csrftoken = response.cookies['csrftoken']
        response = self.client.post('/api/register', {
            "username": "username",
            "password": "12345678",
            "email": "username@example.com"
        }, headers={'X-CSRFToken': csrftoken})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"],
                         "Registered and Logged in successfully.")

        response = self.client.post('/api/login', {
            "username": "username",
            "password": "12345678"
        }, headers={'X-CSRFToken': csrftoken})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Logged in successfully.")

        response = self.client.get("/api/user")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "username")

        response = self.client.get("/api/logout")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["message"], "Logout Successfully")

        response = self.client.get("/api/user")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(response.data["message"], "User is not logged")

    def test_delete_user(self):
        response = self.client.get("/api/set-csrf")
        csrftoken = response.cookies['csrftoken']
        response = self.client.post('/api/register', {
            "username": "username",
            "password": "12345678",
            "email": "username@example.com"
        }, headers={'X-CSRFToken': csrftoken})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"],
                         "Registered and Logged in successfully.")
        response = self.client.delete("/api/user/1")
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)
        self.assertEqual(response.data["message"], "Delete user successfully")

        response = self.client.get("/api/user/1")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["message"], "User Does not exist")

    def test_update_user(self):
        response = self.client.get("/api/set-csrf")
        csrftoken = response.cookies['csrftoken']
        response = self.client.post('/api/register', {
            "username": "username",
            "password": "12345678",
            "email": "username@example.com"
        }, headers={'X-CSRFToken': csrftoken})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["message"],
                         "Registered and Logged in successfully.")

        response = self.client.get("/api/user")

        response = self.client.put("/api/user/{}".format(response.data["id"]), {
            "username": "editedusername",
            "email": "editedusername@example.com"
        }, headers={'X-CSRFToken': csrftoken})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], "editedusername")


class DatasetAPITestCase(APITestCase):
    def setUp(self):
        response = self.client.get("/api/set-csrf")
        csrftoken = response.cookies['csrftoken']
        response = self.client.post('/api/register', {
            "username": "username",
            "password": "12345678",
            "email": "username@example.com"
        }, headers={'X-CSRFToken': csrftoken})

    def test_upload(self):
        response = self.client.get("/api/set-csrf")
        csrftoken = response.cookies['csrftoken']
        header = ['name', 'area', 'country_code2', 'country_code3']

        data = ['Afghanistan', 652090, 'AF', 'AFG']

        with open('countries.csv', 'w', encoding='UTF8') as f:
            writer = csv.writer(f)

            # write the header
            writer.writerow(header)

            # write the data
            writer.writerow(data)

        with open("countries.csv", "r", encoding="utf8") as fp:
            response = self.client.post('/api/dataset', {
                "name": "testname",
                "description": "testdescription",
                "file": fp
            }, headers={'X-CSRFToken': csrftoken})
        os.remove("countries.csv")
        os.remove("./media_root/datasets/user_1/countries.csv")
        self.assertEqual(response.data["name"], "testname")
        self.assertEqual(response.data["upload"],
                         "/media/datasets/user_1/countries.csv")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
