from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
'''from shop.models import Shop
@receiver(post_save, sender=User)
def create_user_shop(sender, instance, created, **kwargs):
	if created:
		Shop.objects.create(user=instance)
@receiver(post_save, sender=User)
def save_user_shop(sender, instance, **kwargs):
	instance.shop.save()'''