from django.urls import path
from . import views
urlpatterns = [
    path("", views.index, name="api_root"),
    path("set-csrf", views.set_csrf_token, name="setcsrtf"),
    path("register", views.register, name="api_register"),
    path("login", views.login_view, name="api_login"),
    path("logout", views.logout_view, name="api_logout"),
    path("user", views.authenticated_user, name="api_user"),
    path("user/<int:id>", views.update_user, name="api_update_user"),
    path("user/<str:action>", views.user_items, name="api_update_user"),
    path("dataset", views.datasets, name="api_datasets"),
    path("dataset/<int:pk>", views.dataset, name="api_dataset"),
    path("preview/<str:type>", views.preview, name="api_preview"),
    path("model", views.models, name="api_models"),
    path("model/<int:pk>", views.model, name="api_model")
]
