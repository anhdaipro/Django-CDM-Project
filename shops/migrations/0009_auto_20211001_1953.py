# Generated by Django 3.2.4 on 2021-10-01 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0008_remove_shipping_charge'),
    ]

    operations = [
        migrations.AddField(
            model_name='variation',
            name='height',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='variation',
            name='length',
            field=models.IntegerField(null=True),
        ),
        migrations.AddField(
            model_name='variation',
            name='width',
            field=models.IntegerField(null=True),
        ),
    ]
