# Generated by Django 3.2.4 on 2021-10-05 07:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0023_review_item'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='view',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='shop',
            name='view',
            field=models.IntegerField(default=0),
        ),
    ]
