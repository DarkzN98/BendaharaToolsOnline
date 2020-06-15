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