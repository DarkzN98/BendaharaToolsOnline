# SERIALIZER MODEL JADI JSON!
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from bendahara.models import Toko, Nota, NotaItem, BukuPraktikum, PenjualanBuku, Barang, PeminjamanBarang
from django.db.models import Sum

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email']

class TokoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Toko
        fields = ['url','id', 'nama_toko']

class NotaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotaItem
        fields = ['nama_item', 'harga_item', 'qty_item']

class NotaSerializer(serializers.HyperlinkedModelSerializer):
    pembeli = UserSerializer()
    toko = TokoSerializer()
    items = NotaItemSerializer(many=True)

    class Meta:
        model = Nota
        fields = ['url', 'id', 'toko', 'tanggal_beli', 'pembeli', 'items']

class BukuPraktikumSerializer(serializers.ModelSerializer):
    terjual = serializers.SerializerMethodField('get_terjual')

    def get_terjual(self, obj):
        return PenjualanBuku.objects.filter(buku=obj).aggregate(Sum('jumlah_penjualan_buku'))

    class Meta:
        model = BukuPraktikum
        fields = ['id', 'nama_buku', 'jurusan_buku','tanggal_cetak_buku', 'harga_beli_buku', 'harga_jual_buku', 'stok_buku', 'terjual']

class PenjualanBukuSerializer(serializers.ModelSerializer):
    buku = BukuPraktikumSerializer()
    class Meta:
        model = PenjualanBuku
        fields = ['id', 'buku', 'tanggal_penjualan_buku', 'lab_penjualan_buku', 'jumlah_penjualan_buku', 'terima_uang_penjualan_buku', 'confirmed_uang_penjualan_buku']

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")

class BarangSerializer(serializers.ModelSerializer):
    user_konfirmasi_kembali = UserSerializer()
    class Meta:
        model = Barang
        fields = ['url', 'id', 'nama_barang', 'id_stiker', 'tanggal_kembali', 'user_konfirmasi_kembali']

class PeminjamanBarangSerializer(serializers.HyperlinkedModelSerializer):
    user_meminjamkan = UserSerializer()
    barangs = BarangSerializer(many=True)
    class Meta:
        model = PeminjamanBarang
        fields = ['url', 'id', 'nama_peminjam' , 'tanggal_peminjaman', 'user_meminjamkan', 'barangs']