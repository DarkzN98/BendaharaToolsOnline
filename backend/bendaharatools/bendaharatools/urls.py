"""bendaharatools URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# import router
from rest_framework import routers

# import auth
from rest_framework.authtoken.views import obtain_auth_token

from bendahara import views
from bendahara.api import LoginAPI

router = routers.DefaultRouter()
router.register(r'barangs', views.BarangViewSet)
router.register(r'bukus', views.BukuPraktikumViewSet)
router.register(r'notas', views.NotaViewSet)
router.register(r'peminjamans', views.PeminjamanBarangViewSet)
router.register(r'penjualans', views.PenjualanBukuViewSet)
router.register(r'tokos', views.TokoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]
