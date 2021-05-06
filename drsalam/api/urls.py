from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import ObtainAuthToken
from api.views import *
# from api.admins.views import *

#User
router = routers.SimpleRouter()
router.register(r'medias', MediaViewSet)
router.register(r'doctors', DoctorViewSet)
router.register(r'cities', CityViewSet)
router.register(r'doctor-comments', DoctorCommentViewSet)
router.register(r'doctor-visits', DoctorVisitViewSet)
router.register(r'doctor-favs', DoctorFavViewSet)
# router.register(r'admin/categories', AdminCategoryViewSet)
# router.register(r'admin/orders', AdminOrderViewSet)

urlpatterns = router.urls

#User
urlpatterns += [
    path('auth/login/', MemberLoginView.as_view()),
    path('auth/register/', MemberRegisterView.as_view()),
    path('member/profile/', MemberProfileViewSet.as_view({'get': 'retrieve', 'put': 'update'})),
]

#Admin
urlpatterns += [
    # path('admin/users/<int:pk>/update_password/', AdminChangeUserPasswordView.as_view() ),
]