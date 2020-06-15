from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from bendahara.serializers import TokoSerializer, NotaSerializer, LoginSerializer
from bendahara.models import Toko, Nota, NotaItem

import datetime

# VIEWS UNTUK DJANGO_REST
class TokoViewSet(viewsets.ModelViewSet):
    queryset = Toko.objects.all()
    serializer_class = TokoSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Filtering
    def get_queryset(self):
        queryset = Toko.objects.all()
        filter_nama_toko = self.request.query_params.get('nama', None)
        if filter_nama_toko is not None:
            queryset = queryset.filter(nama_toko__icontains=filter_nama_toko)
        return queryset

class NotaViewSet(viewsets.ModelViewSet):
    queryset = Nota.objects.all()
    serializer_class = NotaSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        current_user = request.user
        if not current_user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        post_data = request.data
        try:
            if(post_data["toko"] == ''):
                return Response(status=status.HTTP_400_BAD_REQUEST)
            toko, createdToko = Toko.objects.get_or_create(nama_toko=post_data["toko"])
            nota = Nota.objects.create(toko=toko, pembeli=current_user, tanggal_beli=post_data["tanggal_beli"])
            nota.save()
            for item in post_data["items"]:
                NotaItem.objects.create(nota=nota, nama_item=item['nama_item'], harga_item=item['harga_item'], qty_item=item['qty_item']).save()
            return Response(status=status.HTTP_201_CREATED)
        except:
            return Response(status=status.HTTP_400_BAD_REQUEST)

    # Filter
    def get_queryset(self):
        queryset = Nota.objects.all()
        filter_this_month = self.request.query_params.get('this_month', False)
        if filter_this_month:
            queryset = queryset.filter(tanggal_beli__year=datetime.datetime.now().year)
            queryset = queryset.filter(tanggal_beli__month=datetime.datetime.now().month)
        return queryset
