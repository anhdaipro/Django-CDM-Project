# Generated by Django 3.2.4 on 2021-10-04 10:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_customer_time_off'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='is_online',
            field=models.BooleanField(default=False),
        ),
    ]
