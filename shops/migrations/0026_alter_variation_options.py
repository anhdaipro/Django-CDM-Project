# Generated by Django 3.2.4 on 2021-10-07 11:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0025_auto_20211005_1628'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='variation',
            options={'ordering': ['color', 'size']},
        ),
    ]