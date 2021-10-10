# Generated by Django 3.2.4 on 2021-09-28 09:20

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('shops', '0002_shop_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shop',
            name='followers',
            field=models.ManyToManyField(blank=True, related_name='followers', to=settings.AUTH_USER_MODEL),
        ),
    ]
