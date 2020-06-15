from django.contrib import admin

# Register your models here.
#  register model ke admin

from .models import *

admin.site.register(Toko)
admin.site.register(Nota)
admin.site.register(NotaItem)
admin.site.register(Barang)