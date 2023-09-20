from django.urls import path, include
from . import views
from django.views.decorators.csrf import csrf_exempt

urlpatterns = [
    path("api/v1/", csrf_exempt(views.IndexView.as_view()), name="index"),
    path("api/v1/signup", csrf_exempt(views.RegisterView.as_view()), name="signup"),
    path("api/v1/login", csrf_exempt(views.LoginView.as_view()), name="login"),
    path("api/v1/users", csrf_exempt(views.UserView.as_view()), name="users"),
    path("api/v1/restaurants", csrf_exempt(views.RestaurantView.as_view()), name="restaurants"),
]
