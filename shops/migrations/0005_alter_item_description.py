# Generated by Django 3.2.4 on 2021-09-28 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0004_alter_item_slug'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='description',
            field=models.TextField(max_length=2000),
        ),
    ]
