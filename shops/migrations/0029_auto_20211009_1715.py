# Generated by Django 3.2.4 on 2021-10-09 10:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0028_ipmodel_create_at'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='view',
            field=models.ManyToManyField(blank=True, to='shops.IpModel'),
        ),
        migrations.AddField(
            model_name='shop',
            name='view',
            field=models.ManyToManyField(blank=True, to='shops.IpModel'),
        ),
    ]
