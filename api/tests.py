from django.test import TestCase
from .models import *
from rest_framework.test import APITestCase
from rest_framework import status
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