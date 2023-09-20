from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from .models import Restaurant, User
from .serializer import RestaurantSerializer, UserSerializer
import jwt, datetime, bcrypt, environ

env = environ.Env()
environ.Env.read_env()

class IndexView(APIView):
    def get(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            password = serializer.data["password"] = bcrypt.hashpw(
                serializer.data.get("password").encode(), bcrypt.gensalt()
            )
            User.objects.create(
                username=serializer.data.get("username"),
                password=password.decode("utf-8"),
                email=serializer.data.get("email"),
            )
            payload = {
                "id": serializer.data.get("id"),
                "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
                "iat": datetime.datetime.utcnow(),
            }

            token = jwt.encode(payload, env("JWT_SECRET"), algorithm="HS256")

            return Response(status=status.HTTP_201_CREATED, data={"token": token})

        return Response(
            status=status.HTTP_400_BAD_REQUEST, data=serializer.errors.items()
        )


class LoginView(APIView):
    def post(self, request):
        email_username = request.data.get("email_username")
        password = request.data.get("password")

        user = User.objects.filter(
            Q(email=email_username) | Q(username=email_username)
        ).first()

        if user is None:
            raise AuthenticationFailed("User not found!")

        if not bcrypt.checkpw(password.encode(), user.password.encode()):
            raise AuthenticationFailed("Incorrect password!")

        payload = {
            "id": str(user.id),
            "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7),
            "iat": datetime.datetime.utcnow(),
        }

        token = jwt.encode(payload, env("JWT_SECRET"), algorithm="HS256")

        return Response(status=status.HTTP_200_OK, data={"token": token})


class UserView(APIView):
    def get(self, request):
        try:
            token = request.headers.get("Authorization").split(" ")[1]
        except:
            token = None

        if not token:
            raise AuthenticationFailed("Unauthenticated!")

        try:
            payload = jwt.decode(token, env("JWT_SECRET"), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired!")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token!")
        except:
            raise AuthenticationFailed("Unauthenticated!")

        user = User.objects.filter(id=payload["id"]).first()
        serializer = UserSerializer(user)
        return Response(
            {
                "id": serializer.data.get("id"),
                "username": serializer.data.get("username"),
                "email": serializer.data.get("email"),
            }
        )


class RestaurantView(APIView):
    def get(self, request):
        id = request.query_params.get("id")
        if id is not None:
            restaurant = Restaurant.objects.filter(
                id=request.query_params.get("id")
            ).first()
            if restaurant is not None:
                serializer = RestaurantSerializer(restaurant)
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            serializer = RestaurantSerializer(Restaurant.objects.all(), many=True)
            return Response(serializer.data)

    def post(self, request):
        try:
            token = request.headers.get("Authorization").split(" ")[1]
        except:
            token = None

        if not token:
            raise AuthenticationFailed("Unauthenticated!")

        try:
            jwt.decode(token, env("JWT_SECRET"), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired!")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token!")
        except:
            raise AuthenticationFailed("Unauthenticated!")

        serializer = RestaurantSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)

    def put(self, request):
        try:
            token = request.headers.get("Authorization").split(" ")[1]
        except:
            token = None

        if not token:
            raise AuthenticationFailed("Unauthenticated!")

        try:
            jwt.decode(token, env("JWT_SECRET"), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired!")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token!")
        except:
            raise AuthenticationFailed("Unauthenticated!")

        id = request.query_params.get("id")
        if id is not None:
            try:
                restaurant = Restaurant.objects.get(id=id)
                serializer = RestaurantSerializer(restaurant, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        try:
            token = request.headers.get("Authorization").split(" ")[1]
        except:
            token = None

        if not token:
            raise AuthenticationFailed("Unauthenticated!")

        try:
            jwt.decode(token, env("JWT_SECRET"), algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed("Token expired!")
        except jwt.InvalidTokenError:
            raise AuthenticationFailed("Invalid token!")
        except:
            raise AuthenticationFailed("Unauthenticated!")

        id = request.query_params.get("id")
        if id is not None:
            try:
                restaurant = Restaurant.objects.get(id=id)
                restaurant.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            except:
                return Response(status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
