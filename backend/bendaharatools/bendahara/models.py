from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator

# Create your models here.
class Toko(models.Model):
    nama_toko = models.CharField(max_length=50, validators=[MinLengthValidator(1, 'nama_toko cannot be blank')] )

    def __str__(self):
        return f"{self.nama_toko}"

class Nota(models.Model):
    toko = models.ForeignKey(Toko, on_delete=models.CASCADE)
    tanggal_beli = models.DateField()
    pembeli = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.id} - {self.toko.nama_toko} [{self.tanggal_beli}]'

class NotaItem(models.Model):
    nota = models.ForeignKey(Nota, related_name='items', on_delete=models.CASCADE, to_field='id')
    nama_item = models.CharField(max_length=100)
    harga_item = models.IntegerField()
    qty_item = models.IntegerField()

    def __str__(self):
        return f'{self.nama_item}'

class Barang(models.Model):
    nama_barang = models.CharField(max_length=50)
    id_stiker = models.CharField(max_length=4)

class BukuPraktikum(models.Model):
    nama_buku = models.CharField(max_length=50)
    jurusan_buku = models.CharField(max_length=3)
    tanggal_cetak_buku = models.DateField()
    harga_beli_buku = models.IntegerField()
    harga_jual_buku = models.IntegerField()
    stok_buku = models.PositiveSmallIntegerField()

    def __str__(self):
        return f'{self.nama_buku} [{self.jurusan_buku} {self.tanggal_cetak_buku.year}]'

class PenjualanBuku(models.Model):
    buku = models.ForeignKey(BukuPraktikum, on_delete=models.CASCADE, to_field='id')
    tanggal_penjualan_buku = models.DateField()
    lab_penjualan_buku = models.CharField(max_length=5)
    jumlah_penjualan_buku = models.PositiveSmallIntegerField()
    terima_uang_penjualan_buku = models.IntegerField()
    confirmed_uang_penjualan_buku = models.BooleanField(default=False)

    def __str__(self):
        return f'Penjualan Buku {self.buku.nama_buku} - {self.lab_penjualan_buku} [{self.tanggal_penjualan_buku.year}] { "OK" if self.confirmed_uang_penjualan_buku else ""}'
