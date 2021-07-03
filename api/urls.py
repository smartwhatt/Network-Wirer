from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="api_root"),
    path("set-csrf", views.set_csrf_token, name="setcsrtf"),
    path("register", views.register, name="api_register"),
    path("login", views.login_view, name="api_login"),
    path("logout", views.logout_view, name="api_logout"),
    path("user", views.authenticated_user, name="api_user")
]
