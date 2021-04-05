from django.contrib.auth.models import PermissionsMixin, Group
from django.contrib.auth.base_user import AbstractBaseUser
from django.utils.text import slugify
from main.managers import *
from django.core.mail import send_mail
from django.db import models
from django.core.validators import RegexValidator, validate_slug
from stdimage import StdImageField, JPEGField
from django.utils.translation import ugettext_lazy as _
from django.shortcuts import reverse

class User(AbstractBaseUser, PermissionsMixin):
	phone_regex = RegexValidator(
		regex=r'^\+?1?\d{9,15}$', message="تلفن همراه باید با این فرمت نوشته شود: '+999999999'.")
	username = models.CharField(unique=True, max_length=50)
	date_joined = models.DateTimeField(auto_now_add=True)
	is_staff = models.BooleanField(default=False)

	objects = UserManager()

	USERNAME_FIELD = 'username'
	REQUIRED_FIELDS = []

	def __str__(self):
		return self.username


class Media(models.Model):
	name = models.CharField(max_length=254, blank=True, null=True)
	file = StdImageField(upload_to='uploads/%Y/%m/%d/', variations={
		'large': (600, 400),
		'thumbnail': (100, 100, True),
		'medium': (300, 200),
	}, delete_orphans=True)

	def __str__(self):
		if self.name:
			return self.name
		return str(self.file)

class City(models.Model):
    name = models.CharField(max_length=254)

class Doctor(models.Model):
	user = models.OneToOneField("main.User", on_delete=models.CASCADE, related_name='doctor')
	name = models.CharField(max_length=254)
	unique_id = models.IntegerField()
	city = models.ForeignKey("main.City", on_delete=models.SET_NULL, blank=True, null=True, related_name='doctors')
	address = models.TextField(blank=True, null=True)
	phone = models.CharField(max_length=100, blank=True, null=True)
	field = models.CharField(max_length=254, blank=True, null=True)
	education = models.CharField(max_length=254, blank=True, null=True)
	day0 = models.CharField(max_length=50, blank=True, null=True)
	day1 = models.CharField(max_length=50, blank=True, null=True)
	day2 = models.CharField(max_length=50, blank=True, null=True)
	day3 = models.CharField(max_length=50, blank=True, null=True)
	day4 = models.CharField(max_length=50, blank=True, null=True)
	day5 = models.CharField(max_length=50, blank=True, null=True)
	day6 = models.CharField(max_length=50, blank=True, null=True)

	def __str__(self):
		return self.name

class Member(models.Model):
	user = models.OneToOneField("main.User", on_delete=models.CASCADE, related_name='member')
	first_name = models.CharField(max_length=254, blank=True, null=True)
	last_name = models.CharField(max_length=254, blank=True, null=True)
	phone = models.CharField(max_length=100, blank=True, null=True)

	def get_full_name(self):
		return "{} {}".format(self.first_name, self.last_name)
	
	def __str__(self):
		return self.get_full_name()
        
        class DoctorComment(models.Model):
	doctor = models.ForeignKey("main.Doctor", on_delete=models.CASCADE, related_name='comments')
	member = models.ForeignKey("main.Member", on_delete=models.CASCADE, related_name='doctor_comments')
	content = models.TextField()

	def __str__(self):
		return self.content

	class Meta:
		ordering = ['-id']

class DoctorVisit(models.Model):
	doctor = models.ForeignKey("main.Doctor", on_delete=models.CASCADE, related_name='visits')
	member = models.ForeignKey("main.Member", on_delete=models.CASCADE, related_name='visits')
	datetime = models.DateTimeField()

	def __str__(self):
		return self.datetime.strftime("%Y-%m-%dT%H:%M:%S")

class DoctorFav(models.Model):
	doctor = models.ForeignKey("main.Doctor", on_delete=models.CASCADE, related_name='+')
	member = models.ForeignKey("main.Member", on_delete=models.CASCADE, related_name='doctor_favs')

