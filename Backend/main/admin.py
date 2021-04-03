from django.contrib import admin
from main.models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Media)
admin.site.register(City)
admin.site.register(Doctor)
admin.site.register(Member)
admin.site.register(DoctorComment)
admin.site.register(DoctorVisit)
admin.site.register(DoctorFav)