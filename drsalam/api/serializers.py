from rest_framework.response import Response
from rest_framework import serializers, exceptions
from rest_framework.fields import CurrentUserDefault
from main.models import *


class MediaSerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    medium = serializers.SerializerMethodField()
    large = serializers.SerializerMethodField()

    def __init__(self, *args, **kwargs):
        if 'request' in kwargs:
            self.request = kwargs['request']
            del kwargs['request']
        else:
            self.request = None
        super(MediaSerializer, self).__init__(*args, **kwargs)

    @staticmethod
    def build_url(self, url):
        if self.request:
            return self.request.build_absolute_uri(url)
        elif 'request' in self.context:
            return self.context['request'].build_absolute_uri(url)
        elif 'view' in self.context:
            return self.context['view'].request.build_absolute_uri(url)
        return url

    def get_thumbnail(self, obj):
        if obj.file:
            return self.build_url(self, obj.file.thumbnail.url)

    def get_medium(self, obj):
        if obj.file:
            return self.build_url(self, obj.file.medium.url)

    def get_large(self, obj):
        if obj.file:
            return self.build_url(self, obj.file.large.url)

    def get_file(self, obj):
        return self.build_url(self, obj.file.url)

    class Meta:
        model = Media
        fields = ['id', 'name', 'file', 'thumbnail', 'medium', 'large']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    city = CitySerializer(read_only=True)
    class Meta:
        model = Doctor
        fields = '__all__'

class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Member
        fields = '__all__'

class MemberRegisterSerializer(MemberSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False, source='user')
    class Meta:
        model = Member
        fields = ['id', 'user', 'user_id', 'first_name', 'last_name', 'phone']

class DoctorCommentSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), required=False, source='doctor')
    member = MemberSerializer(read_only=True)
    member_id = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all(), required=False, source='member')

    class Meta:
        model = DoctorComment
        fields = ['id','doctor', 'doctor_id', 'member', 'member_id', 'content']


class DoctorVisitSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), required=False, source='doctor')
    member = MemberSerializer(read_only=True)
    member_id = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all(), required=False, source='member')

    class Meta:
        model = DoctorVisit
        fields = ['id','doctor', 'doctor_id', 'member', 'member_id', 'datetime']

class DoctorFavSerializer(serializers.ModelSerializer):
    doctor = DoctorSerializer(read_only=True)
    doctor_id = serializers.PrimaryKeyRelatedField(queryset=Doctor.objects.all(), required=False, source='doctor')
    member = MemberSerializer(read_only=True)
    member_id = serializers.PrimaryKeyRelatedField(queryset=Member.objects.all(), required=False, source='member')

    class Meta:
        model = DoctorFav
        fields = ['id','doctor', 'doctor_id', 'member', 'member_id']
