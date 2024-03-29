# Generated by Django 3.0.7 on 2020-06-09 10:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Barang',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_barang', models.CharField(max_length=50)),
                ('id_stiker', models.CharField(max_length=4)),
            ],
        ),
        migrations.CreateModel(
            name='Nota',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('tanggal_beli', models.DateField()),
                ('pembeli', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Toko',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_toko', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='NotaItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nama_item', models.CharField(max_length=100)),
                ('harga_item', models.IntegerField()),
                ('qty_item', models.IntegerField()),
                ('nota', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bendahara.Nota')),
            ],
        ),
        migrations.AddField(
            model_name='nota',
            name='toko',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='bendahara.Toko'),
        ),
    ]
