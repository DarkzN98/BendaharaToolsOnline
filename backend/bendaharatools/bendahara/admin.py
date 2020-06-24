from django.contrib import admin

# Register your models here.
#  register model ke admin

from .models import Toko, Nota, NotaItem, Barang, BukuPraktikum, PenjualanBuku

admin.site.register(Toko)
admin.site.register(Nota)
admin.site.register(NotaItem)
admin.site.register(Barang)
admin.site.register(BukuPraktikum)
admin.site.register(PenjualanBuku)