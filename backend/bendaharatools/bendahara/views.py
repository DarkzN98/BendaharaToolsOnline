from django.shortcuts import render
from django.contrib.auth.models import User
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from bendahara.serializers import TokoSerializer, NotaSerializer, LoginSerializer, BukuPraktikumSerializer, PenjualanBukuSerializer, BarangSerializer, PeminjamanBarangSerializer, UserSerializer
from bendahara.models import Toko, Nota, NotaItem, BukuPraktikum, PenjualanBuku, Barang, PeminjamanBarang, User

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

class BukuPraktikumViewSet(viewsets.ModelViewSet):
    queryset = BukuPraktikum.objects.all()
    serializer_class = BukuPraktikumSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Filtering
    def get_queryset(self):
        queryset = BukuPraktikum.objects.all()
        filter_this_semester = self.request.query_params.get('this_semester', False)
        if(filter_this_semester):
            # check tanggal sekarang ada di semester bberapa
            if(datetime.datetime.now().month <= 6):
                # SMT Genap ?
                queryset = queryset.filter(tanggal_cetak_buku__range=(datetime.datetime.strptime(f'{datetime.datetime.now().year}-01-01', '%Y-%m-%d'), datetime.datetime.strptime(f'{datetime.datetime.now().year}-06-30', '%Y-%m-%d')))
            else:
                queryset = queryset.filter(tanggal_cetak_buku__range=(datetime.datetime.strptime(f'{datetime.datetime.now().year}-07-01', '%Y-%m-%d'), datetime.datetime.strptime(f'{datetime.datetime.now().year}-12-31', '%Y-%m-%d')))
        return queryset

class PenjualanBukuViewSet(viewsets.ModelViewSet):
    queryset = PenjualanBuku.objects.all()
    serializer_class = PenjualanBukuSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        current_user = request.user
        if not current_user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        post_data = request.data
        try:
            buku_prak = BukuPraktikum.objects.get(id=post_data["id_buku"])
            try_date = datetime.datetime.strptime(post_data['tanggal_penjualan_buku'], '%Y-%m-%d')
            if post_data["lab_penjualan_buku"] == "":
                raise Exception('Lab Tidak Valid !')
            if int(post_data['jumlah_penjualan_buku']) <= 0:
                raise Exception('Jumlah Penjualan Buku Tidak valid !')
            if int(post_data['terima_uang_penjualan_buku']) <= 0:
                raise Exception('Jumlah Uang Yang Diterima Tidak Valid !')
            new_penjualan = PenjualanBuku.objects.create(buku=buku_prak, tanggal_penjualan_buku=post_data['tanggal_penjualan_buku'], lab_penjualan_buku= post_data['lab_penjualan_buku'], jumlah_penjualan_buku=post_data['jumlah_penjualan_buku'], terima_uang_penjualan_buku=post_data['terima_uang_penjualan_buku'])
            new_penjualan.save()
            return Response(status=status.HTTP_201_CREATED)
        except ObjectDoesNotExist:
            return Response(data="ID Buku Praktikum Tidak Valid !" ,status=status.HTTP_400_BAD_REQUEST)
        except Exception as ex:
            return Response(data=ex.args, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        queryset = PenjualanBuku.objects.all()
        filter_this_semester = self.request.query_params.get('this_semester', False)
        if(filter_this_semester):
            # check tanggal sekarang ada di semester bberapa
            if(datetime.datetime.now().month <= 6):
                # SMT Genap ?
                queryset = queryset.filter(tanggal_penjualan_buku__range=(datetime.datetime.strptime(f'{datetime.datetime.now().year}-01-01', '%Y-%m-%d'), datetime.datetime.strptime(f'{datetime.datetime.now().year}-06-30', '%Y-%m-%d')))
            else:
                queryset = queryset.filter(tanggal_penjualan_buku__range=(datetime.datetime.strptime(f'{datetime.datetime.now().year}-07-01', '%Y-%m-%d'), datetime.datetime.strptime(f'{datetime.datetime.now().year}-12-31', '%Y-%m-%d')))
        return queryset

class BarangViewSet(viewsets.ModelViewSet):
    queryset = Barang.objects.all()
    serializer_class = BarangSerializer
    permission_classes = [permissions.IsAuthenticated]

    def partial_update(self, request, pk=None):
        current_user = request.user
        instance = self.get_object()
        if not current_user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        if not instance:
            return Response(status=status.HTTP_404_NOT_FOUND)
        instance.user_konfirmasi_kembali = current_user
        instance.tanggal_kembali = request.data["tanggal_kembali"]
        instance.save()
        return Response(status=status.HTTP_200_OK)
        

class PeminjamanBarangViewSet(viewsets.ModelViewSet):
    queryset = PeminjamanBarang.objects.all()
    serializer_class = PeminjamanBarangSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        current_user = request.user
        if not current_user:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        post_data = request.data
        
        try:
            peminjaman_barang = PeminjamanBarang.objects.create(nama_peminjam=post_data['nama_peminjam'], user_meminjamkan=current_user)
            for barang in post_data['barangs']:
                Barang.objects.create(peminjaman_barang=peminjaman_barang, nama_barang=barang['nama_barang'], id_stiker=barang['id_stiker'])
            return Response(status=status.HTTP_201_CREATED)
        except Exception as ex:
            return Response(data=ex.args, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(status=status.HTTP_200_OK)