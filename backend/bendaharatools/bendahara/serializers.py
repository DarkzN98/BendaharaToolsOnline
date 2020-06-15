# SERIALIZER MODEL JADI JSON!
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import serializers
from bendahara.models import Toko, Nota, NotaItem

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

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")