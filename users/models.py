# # from django.contrib.auth.models import User
# # from django.db import models


# # class UserProfile(models.Model):
# #     user = models.OneToOneField(
# #         User,
# #         on_delete=models.CASCADE,
# #         related_name="profile"
# #     )
# #     role = models.CharField(max_length=20, default="user")

# #     def __str__(self):
# #         return self.user.username

# # from django.contrib.auth.models import User
# # from django.db import models


# # class UserProfile(models.Model):
# #     ROLE_CHOICES = (
# #         ("user", "User"),
# #         ("admin", "Admin"),
# #     )

# #     user = models.OneToOneField(
# #         User,
# #         on_delete=models.CASCADE,
# #         related_name="profile"
# #     )
# #     role = models.CharField(
# #         max_length=10,
# #         choices=ROLE_CHOICES,
# #         default="user"
# #     )

# #     def __str__(self):
# #         return f"{self.user.username} - {self.role}"
# # users/models.py
# # from django.db import models
# # from django.contrib.auth.models import User


# # class UserProfile(models.Model):

# #     ROLE_CHOICES = (
# #         ("user", "User"),
# #         ("admin", "Admin"),
# #     )

# #     user = models.OneToOneField(
# #         User,
# #         on_delete=models.CASCADE,
# #         related_name="profile"
# #     )

# #     role = models.CharField(
# #         max_length=10,
# #         choices=ROLE_CHOICES,
# #         default="user"
# #     )

# #     def __str__(self):
# #         return f"{self.user.username} - {self.role}"
# from django.db import models
# from django.contrib.auth.models import User
# from django.db.models.signals import post_save
# from django.dispatch import receiver

# class UserProfile(models.Model):
#     ROLE_CHOICES = [
#         ('viewer', 'Viewer'),
#         ('editor', 'Editor'),
#         ('admin', 'Admin'),
#     ]
    
#     user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
#     role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
#     created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
#     updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
#     def __str__(self):
#         return f"{self.user.username} - {self.role}"

# # FIXED: Auto-create profile when user is created
# @receiver(post_save, sender=User)
# def create_user_profile(sender, instance, created, **kwargs):
#     if created:
#         UserProfile.objects.get_or_create(user=instance)  # Use get_or_create instead of create

# @receiver(post_save, sender=User)
# def save_user_profile(sender, instance, **kwargs):
#     try:
#         instance.profile.save()
#     except UserProfile.DoesNotExist:
#         UserProfile.objects.create(user=instance)
# users/models.py
from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('viewer', 'Viewer'),
        ('editor', 'Editor'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='viewer')
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, blank=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.get_or_create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    try:
        instance.profile.save()
    except UserProfile.DoesNotExist:
        UserProfile.objects.create(user=instance)