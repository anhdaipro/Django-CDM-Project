# Generated by Django 3.2.4 on 2021-10-02 12:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shops', '0013_comment_like_notification_review'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='shop',
            name='check',
        ),
    ]