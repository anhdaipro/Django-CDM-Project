# Generated by Django 3.2.4 on 2021-10-10 13:36

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product_detail', '0011_auto_20211010_2031'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='detail_item',
            name='petite',
        ),
        migrations.DeleteModel(
            name='Petite',
        ),
    ]