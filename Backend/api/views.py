from django.shortcuts import render
from rest_framework.mixins import RetrieveModelMixin, UpdateModelMixin, CreateModelMixin, ListModelMixin
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import *
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.decorators import action
from api.serializers import *
from api.utils import get_doctor_visit_times
from main.models import *
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login
from django.utils.translation import ugettext_lazy as _

# Create your views here.
class TestView(APIView):
    def get(self, *args, **kwargs):
        return Response({"working"})

class MemberLoginView(ObtainAuthToken):
    permission_classes = ()
    authentication_classes = ()

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        token, created = Token.objects.get_or_create(user=user)

        role = request.GET.get('role', 'member')

        if role == 'member':
            try:
                member = Member.objects.get(user=user)
            except Member.DoesNotExist:
                raise Exception(_("Member not found"))
            return Response({
                'token': token.key,
                'member': MemberSerializer(member, context={'request':request}).data,
            })
        raise Exception("Unknown role")

class MemberRegisterView(APIView):
    permission_classes = ()
    authentication_classes = ()
    def post(self, request):
        user_serialzier = UserSerializer(data=request.data)
        if user_serialzier.is_valid(True):
            username = user_serialzier.validated_data.get('username')
            password = request.data.get('password', None)
            password2 = request.data.get('password2', None)
            if not password:
                raise Exception(_('password not entered'))
            
            if password != password2:
                raise Exception(_('Passwords not match'))
            
            member_serializer = MemberRegisterSerializer(data=request.data)
            if member_serializer.is_valid(True):
                new_user = User.objects.create_user(username, password)
                member = member_serializer.save(user_id=new_user.pk)
                token, created = Token.objects.get_or_create(user=new_user)
                return Response({
                    "member": MemberSerializer(member, context={'request': request}).data,
                    "token" : token.key
                })
        return Response({"ok"})

class MemberProfileViewSet(RetrieveModelMixin, UpdateModelMixin, GenericViewSet):
    serializer_class = MemberSerializer
    queryset = Member.objects.all()

    def get_object(self):
        return self.request.user.member

class MediaViewSet(ReadOnlyModelViewSet):
    serializer_class = MediaSerializer
    queryset = Media.objects.all()

class DoctorViewSet(ReadOnlyModelViewSet):
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()
    search_fields = ['name', 'education', 'field', 'city__name']
    
    @action(detail=True, methods=['GET'])
    def comments(self, *args, **kwargs):
        doctor = self.get_object()
        return Response(
            DoctorCommentSerializer(doctor.comments.all(), many=True).data
        )

    @action(detail=True, methods=['GET'])
    def visit_times(self, *args, **kwargs):
        doctor = self.get_object()
        return Response(
            get_doctor_visit_times(doctor)
        )

class DoctorCommentViewSet(ModelViewSet):
    serializer_class = DoctorCommentSerializer
    queryset = DoctorComment.objects.all()

    def perform_create(self, serializer):
        serializer.save(member_id=self.request.user.member.id)

class DoctorVisitViewSet(ModelViewSet):
    serializer_class = DoctorVisitSerializer
    queryset = DoctorVisit.objects.all()

    def get_queryset(self):
        return self.queryset.filter(member=self.request.user.member)

    def perform_create(self, serializer):
        serializer.save(member_id=self.request.user.member.id)

class CityViewSet(ModelViewSet):
    serializer_class = CitySerializer
    queryset = City.objects.all()

class DoctorFavViewSet(ModelViewSet):
    serializer_class = DoctorFavSerializer
    queryset = DoctorFav.objects.all()

    def get_queryset(self):
        return self.queryset.filter(member=self.request.user.member)

    def perform_create(self, serializer):
        if DoctorFav.objects.filter(member=self.request.user.member, doctor=serializer.validated_data.get('doctor')).count() > 0:
            raise Exception("Duplication")
        serializer.save(member_id=self.request.user.member.id)