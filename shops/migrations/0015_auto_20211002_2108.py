# Generated by Django 3.2.4 on 2021-10-02 14:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0014_remove_shop_check'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='product',
        ),
        migrations.RemoveField(
            model_name='like',
            name='product',
        ),
        migrations.RemoveField(
            model_name='notification',
            name='product',
        ),
    ]
